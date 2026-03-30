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

export const resourceCategoryEnum = pgEnum('resource_category_enum', [
  'ORE',
  'INGOT',
  'LOG',
  'PLANK',
  'HIDE',
  'LEATHER',
  'FIBER',
  'CLOTH',
  'HERB',
  'FLOWER',
  'MUSHROOM',
  'FUR',
  'CURED_FUR',
  'BONE',
]);

export const oreValues = ['IRON_ORE', 'COPPER_ORE', 'SILVER_ORE', 'GOLD_ORE', 'MITHRIL_ORE', 'ADAMANTINE_ORE'] as const;
 
export const ingotValues = ['IRON_INGOT', 'COPPER_INGOT', 'SILVER_INGOT', 'GOLD_INGOT', 'MITHRIL_INGOT', 'ADAMANTINE_INGOT'] as const;

export const logValues = [
  'REGULAR_LOG',
  'PINE_LOG',
  'OAK_LOG',
  'ASH_LOG',
  'YEW_LOG',
  'MAHOGANY_LOG',
  'EBONY_LOG',
  'BLOOD_LOG',
  'GHOST_LOG',
] as const;
export const plankValues = [
  'REGULAR_PLANK',
  'PINE_PLANK',
  'OAK_PLANK',
  'ASH_PLANK',
  'YEW_PLANK',
  'MAHOGANY_PLANK',
  'EBONY_PLANK',
  'BLOOD_PLANK',
  'GHOST_PLANK',
] as const;
export const hideValues = ['REGULAR_HIDE', 'ROUGH_HIDE', 'REPTILE_HIDE', 'IRON_HIDE', 'DEMON_HIDE', 'DRAGON_HIDE'] as const;
export const leatherValues = ['REGULAR_LEATHER', 'ROUGH_LEATHER', 'REPTILE_LEATHER', 'IRON_LEATHER', 'DEMON_LEATHER', 'DRAGON_LEATHER'] as const;
export const furValues = ['REGULAR_FUR', 'THICK_FUR', 'DARK_FUR', 'SHADOW_FUR', 'SNOW_FUR'] as const;
export const curedFurValues = ['REGULAR_CURED_FUR', 'THICK_CURED_FUR', 'DARK_CURED_FUR', 'SHADOW_CURED_FUR', 'SNOW_CURED_FUR'] as const;

const mushroomValues = [
  'REDCAP_MUSHROOM',
  'GLOWCAP_MUSHROOM',
  'SHADOWCAP_MUSHROOM',
  'IRONCAP_MUSHROOM',
  'SPORECAP_MUSHROOM',
  'FROSTCAP_MUSHROOM',
] as const;
const flowerValues = ['ROSE', 'SUNFLOWER', 'BLUE_ORCHID', 'NIGHT_BLOOM', 'FIRE_BLOSSOM', 'FROST_LILY'] as const;
const herbValues = ['GREENLEAF', 'SWIFTLEAF', 'BITTERROOT', 'SUNGRASS', 'GHOST_HERB', 'BLOOD_HERB', 'JASMINE'] as const;

export const fiberValues = ['COTTON', 'FLAX'] as const;

export const clothValues = ['REGULAR_CLOTH'] as const;
export const boneValues = ['REGULAR_BONE'] as const;

export const oreTypeEnum = pgEnum('ore_type_enum', [...oreValues]);
export const ingotTypeEnum = pgEnum('ingot_type_enum', [...ingotValues]);
export const logTypeEnum = pgEnum('log_type_enum', [...logValues]);
export const plankTypeEnum = pgEnum('plank_type_enum', [...plankValues]);
export const hideTypeEnum = pgEnum('hide_type_enum', [...hideValues]);
export const leatherTypeEnum = pgEnum('leather_type_enum', [...leatherValues]);
export const furTypeEnum = pgEnum('fur_type_enum', [...furValues]);
export const curedFurTypeEnum = pgEnum('cured_fur_type_enum', [...curedFurValues]);
export const clothTypeEnum = pgEnum('cloth_type_enum', [...clothValues]);
export const fiberTypeEnum = pgEnum('fiber_type_enum', [...fiberValues]);
export const flowerTypeEnum = pgEnum('flower_type_enum', [...flowerValues]);
export const mushroomTypeEnum = pgEnum('mushroom_type_enum', [...mushroomValues]);
export const herbTypeEnum = pgEnum('herb_type_enum', [...herbValues]);
export const boneTypeEnum = pgEnum('bone_type_enum', [...boneValues]);

export const resourceTypeEnum = pgEnum('resource_type_enum', [
  ...oreValues,
  ...ingotValues,
  ...logValues,
  ...plankValues,
  ...hideValues,
  ...leatherValues,
  ...furValues,
  ...curedFurValues,
  ...clothValues,
  ...fiberValues,
  ...flowerValues,
  ...herbValues,
  ...mushroomValues,
  ...boneValues,
]);
export const coreResourceTypeEnum = pgEnum('core_resource_enum', [
  ...ingotValues,
  ...clothValues,
  ...plankValues,
  ...leatherValues,
  ...curedFurValues,
  ...boneValues,
]);

//////////////

export const itemLocationEnum = pgEnum('item_location_enum', [
  'BACKPACK',
  'BANK',
  'MARKET',
  'CORPSE',
  'LOOM',
  'SAWMILL',
  'TANNERY',
  'FORGE',
  'EQUIPMENT',
]);
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
  modifier: jsonb('modifier').$type<Partial<OmitModifier>>(),
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
