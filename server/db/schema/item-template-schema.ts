import type { OmitModifier,  TEquipInfo, TPotionInfo, TResourceInfo } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, text, uuid } from 'drizzle-orm/pg-core';

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

export const itemTemplateTable = pgTable('item_template', {
  id: uuid().primaryKey().notNull(),
  type: itemTemplateEnum().notNull(),
  name: text().notNull(),
  image: text().notNull(),
  stackable: boolean().notNull(),
  maxStack: integer().notNull().default(1),
  buyPrice: integer(),

  equipInfo: jsonb('equipInfo').$type<TEquipInfo>(),
  resourceInfo: jsonb('resourceInfo').$type<TResourceInfo>(),
  potionInfo: jsonb('potionInfo').$type<TPotionInfo>(),
  coreModifier: jsonb('coreModifier').$type<Partial<OmitModifier>>(),
});

export const itemTemplateRelations = relations(itemTemplateTable, ({}) => ({}));
