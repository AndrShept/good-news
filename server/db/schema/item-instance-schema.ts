import type { ItemDurability, OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { itemContainerTable } from './item-container-schema';

export const itemTemplateEnum = pgEnum('item_template_enum', [
  'WEAPON',
  'ARMOR',
  'SHIELD',
  'POTION',
  'RESOURCES',
  'MISC',
  'ACCESSORY',
  'SKILL_BOOK',
  'TOOL',
]);

export const armorCategoryEnum = pgEnum('armor_category_enum', ['PLATE', 'MAIL', 'LEATHER', 'CLOTH']);
export const armorTypeEnum = pgEnum('armor_type_enum', ['HELMET', 'CHEST', 'LEGS', 'BELT', 'BOOTS', 'GLOVES', 'SHIELD']);

export const weaponTypeEnum = pgEnum('weapon_type_enum', ['DAGGER', 'SWORD', 'AXE', 'STAFF', 'MACE']);

export const weaponHandEnum = pgEnum('weapon_hand_enum', ['ONE_HANDED', 'TWO_HANDED']);

const oreValues = ['IRON_ORE', 'COPPER_ORE', 'SILVER_ORE', 'GOLD_ORE', 'MITHRIL_ORE', 'ADAMANTINE_ORE'] as const;
const leatherValues = ['REGULAR_LEATHER'] as const;
const ingotValues = ['IRON_INGOT', 'COPPER_INGOT', 'SILVER_INGOT', 'GOLD_INGOT', 'MITHRIL_INGOT', 'ADAMANTINE_INGOT'] as const;
const clothValues = ['REGULAR_CLOTH'] as const;

export const ingotTypeEnum = pgEnum('ingot_type_enum', [...ingotValues]);
export const oreTypeEnum = pgEnum('ore_type_enum', [...oreValues]);
export const leatherTypeEnum = pgEnum('leather_type_enum', [...leatherValues]);
export const clothTypeEnum = pgEnum('leather_type_enum', [...clothValues]);

export const resourceTypeEnum = pgEnum('resource_type_enum', [...oreValues, ...leatherValues, ...ingotValues, ...clothValues]);
export const coreResourceTypeEnum = pgEnum('core_resource_enum', [...leatherValues, ...ingotValues, ...clothValues]);
export const resourceCategoryEnum = pgEnum('resource_category_enum', ['ORE', 'WOOD', 'HERB', 'LEATHER', 'INGOT', 'CLOTH']);

//////////////

export const itemLocationEnum = pgEnum('item_location_enum', ['BANK', 'BACKPACK', 'EQUIPMENT', 'LOOT', 'MARKET']);
export const rarityEnum = pgEnum('rarity_enum', ['COMMON', 'UNCOMMON', 'MAGIC', 'RARE', 'EPIC', 'LEGENDARY']);
export const slotEnum = pgEnum('equipment_slot_enum', [
  'RIGHT_HAND',
  'LEFT_HAND',
  'HELMET',
  'CHEST',
  'LEGS',
  'BOOTS',
  'GLOVES',
  'AMULET',
  'RING_LEFT',
  'RING_RIGHT',
  'BELT',
  'SHIELD',
]);
export const itemInstanceTable = pgTable('item_instance', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  displayName: text(),
  ownerHeroId: uuid().references(() => heroTable.id, { onDelete: 'cascade' }),
  itemContainerId: uuid().references(() => itemContainerTable.id, { onDelete: 'cascade' }),
  itemTemplateId: uuid().notNull(),
  location: itemLocationEnum().notNull(),
  coreResource: coreResourceTypeEnum(),
  coreResourceModifier: jsonb('coreResourceModifier').$type<Partial<OmitModifier>>(),
  durability: jsonb('durability').$type<ItemDurability>(),
  slot: slotEnum(),
  marketPrice: integer(),
  quantity: integer().default(1).notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const itemInstanceRelations = relations(itemInstanceTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [itemInstanceTable.ownerHeroId],
    references: [heroTable.id],
  }),
  itemContainer: one(itemContainerTable, {
    fields: [itemInstanceTable.itemContainerId],
    references: [itemContainerTable.id],
  }),
}));
