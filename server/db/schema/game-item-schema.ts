import type { BuildingType, CraftInfo, ResourceCategoryType } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import type { buffTable } from './buff-schema';
import { containerSlotTable } from './container-slot-schema';
import { armorMaterialCraftTypeEnum, ingotTypeEnum, resourceCategoryEnum, resourceTable } from './resource-schema';

export const gameItemEnum = pgEnum('game_item_enum', ['WEAPON', 'ARMOR', 'SHIELD', 'POTION', 'RESOURCES', 'MISC']);

export const armorTypeEnum = pgEnum('armor_type_enum', ['PLATE', 'MAIL', 'LEATHER', 'CLOTH']);
export const armorSlotEnum = pgEnum('armor_slot_enum', ['HELMET', 'CHEST', 'LEGS', 'BELT', 'BOOTS', 'GLOVES' , 'SHIELD']);
export const accessorySlotEnum = pgEnum('accessory_slot_enum', ['RING', 'AMULET']);

export const weaponTypeEnum = pgEnum('weapon_type_enum', ['DAGGER', 'SWORD', 'AXE', 'STAFF']);

export const weaponHandEnum = pgEnum('weapon_hand_enum', ['ONE_HANDED', 'TWO_HANDED']);

export const potionTypeEnum = pgEnum('potion_type_enum', ['BUFF', 'RESTORE']);

export const gameItemTable = pgTable('game_item', {
  id: uuid().primaryKey().notNull(),

  type: gameItemEnum().notNull(),
  name: text().notNull(),
  image: text().notNull(),
  price: integer().default(0).notNull(),
  craftInfo: jsonb().$type<CraftInfo>(),
  createdAt: timestamp('created_at', {
    mode: 'string',
    withTimezone: true,
  })
    .notNull()
    .defaultNow(),
});

export const gameItemRelations = relations(gameItemTable, ({ one, many }) => ({
  containerSlots: many(containerSlotTable),
  weapon: one(weaponTable),
  armor: one(armorTable),
  shield: one(shieldTable),
  potion: one(potionTable),
  accessory: one(accessoryTable),
  resource: one(resourceTable),
}));

//WEAPON
export const weaponTable = pgTable('weapon', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  material: ingotTypeEnum(),
  gameItemId: uuid()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    }) 
    .notNull(),

  weaponType: weaponTypeEnum().notNull(),
  weaponHand: weaponHandEnum().notNull(),

  maxDamage: integer().notNull(),
  minDamage: integer().notNull(),

  spellDamage: integer().default(0).notNull(),
  spellCritPower: integer().default(0).notNull(),
  spellCritChance: integer().default(0).notNull(),
  spellHitChance: integer().default(0).notNull(),

  physDamage: integer().default(0).notNull(),
  physCritPower: integer().default(0).notNull(),
  physCritChance: integer().default(0).notNull(),
  physHitChance: integer().default(0).notNull(),
});

export const weaponTableRelations = relations(weaponTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [weaponTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));

//ARMOR
export const armorTable = pgTable('armor', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  material: armorMaterialCraftTypeEnum(),
  slot: armorSlotEnum().notNull(),
  type: armorTypeEnum().notNull(),
  defense: integer().notNull(),
  magicResistance: integer().notNull(),
  evasion: integer().notNull(),
  maxHealth: integer().notNull(),
  maxMana: integer().notNull(),

  gameItemId: uuid()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const armorTableRelations = relations(armorTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [armorTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
//SHIELD
export const shieldTable = pgTable('shield', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  material: ingotTypeEnum(),
  slot: armorSlotEnum().notNull(),
  defense: integer().notNull(),
  magicResistance: integer().notNull(),
  evasion: integer().notNull(),
  maxHealth: integer().notNull(),
  maxMana: integer().notNull(),

  gameItemId: uuid()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const shieldTableRelations = relations(shieldTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [shieldTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
//ACCESSORY
export const accessoryTable = pgTable('accessory', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  slot: accessorySlotEnum().notNull(),
  gameItemId: uuid()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
});

export const accessoryTableRelations = relations(accessoryTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [accessoryTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));

//POTION
export const potionTable = pgTable('potion', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  type: potionTypeEnum().notNull(),
  gameItemId: uuid()
    .references(() => gameItemTable.id, {
      onDelete: 'cascade',
    })
    .notNull(),
  restore: jsonb('restore').$type<{ mana?: number; health?: number }>(),
  buffInfo:
    jsonb('buffInfo').$type<Pick<typeof buffTable.$inferInsert, 'type' | 'name' | 'image' | 'modifier' | 'duration' | 'gameItemId'>>(),
});

export const potionTableRelations = relations(potionTable, ({ one }) => ({
  gameItem: one(gameItemTable, {
    fields: [potionTable.gameItemId],
    references: [gameItemTable.id],
  }),
}));
