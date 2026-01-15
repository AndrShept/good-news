import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { itemContainerTable } from './item-container-schema';

export const itemTemplateEnum = pgEnum('item_template_enum', ['WEAPON', 'ARMOR', 'SHIELD', 'POTION', 'RESOURCES', 'MISC', 'ACCESSORY']);

export const armorCategoryEnum = pgEnum('armor_category_enum', ['PLATE', 'MAIL', 'LEATHER', 'CLOTH']);
export const armorTypeEnum = pgEnum('armor_type_enum', ['HELMET', 'CHEST', 'LEGS', 'BELT', 'BOOTS', 'GLOVES', 'SHIELD']);

export const weaponTypeEnum = pgEnum('weapon_type_enum', ['DAGGER', 'SWORD', 'AXE', 'STAFF']);

export const weaponHandEnum = pgEnum('weapon_hand_enum', ['ONE_HANDED', 'TWO_HANDED']);

const oreValues = ['IRON-ORE', 'COPPER-ORE', 'SILVER-ORE', 'GOLD-ORE', 'MITHRIL-ORE', 'ADAMANTINE-ORE'] as const;
const leatherValues = ['REGULAR-LEATHER'] as const;
const ingotValues = ['IRON-INGOT', 'COPPER-INGOT', 'SILVER-INGOT', 'GOLD-INGOT', 'MITHRIL-INGOT', 'ADAMANTINE-INGOT'] as const;

export const ingotTypeEnum = pgEnum('ingot_type_enum', [...ingotValues]);
export const oreTypeEnum = pgEnum('ore_type_enum', [...oreValues]);
export const leatherTypeEnum = pgEnum('leather_type_enum', [...leatherValues]);

export const resourceTypeEnum = pgEnum('resource_type_enum', [...oreValues, ...leatherValues, ...ingotValues]);
export const coreMaterialTypeEnum = pgEnum('core_material_enum', [...leatherValues, ...ingotValues]);
export const resourceCategoryEnum = pgEnum('resource_category_enum', ['ORE', 'WOOD', 'HERB', 'LEATHER', 'INGOT']);

//////////////

export const itemLocationEnum = pgEnum('item_location_enum', ['BANK', 'BACKPACK', 'EQUIPMENT', 'LOOT', 'MARKET']);
export const rarityEnum = pgEnum('rarity_enum', ['COMMON', 'MAGIC', 'EPIC', 'RARE', 'LEGENDARY']);
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
  ownerHeroId: uuid().references(() => heroTable.id, { onDelete: 'cascade' }),
  itemContainerId: uuid().references(() => itemContainerTable.id, { onDelete: 'cascade' }),
  itemTemplateId: uuid().notNull(),
  location: itemLocationEnum().notNull(),
  coreMaterial: coreMaterialTypeEnum(),
  materialModifier: jsonb('materialModifier').$type<Partial<OmitModifier>>(),
  slot: slotEnum(),
  marketPrice: integer(),
  durability: integer(),
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
