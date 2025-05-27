import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { modifierTable } from './modifier-schema';

export const gameItemEnum = pgEnum('game_item_enum', [
  'POTION',
  'BOOK',
  'DAGGER',
  'SWORD',
  'AXE',
  'STAFF',
  'CHESTPLATE',
  'BELT',
  'BOOTS',
  'HELMET',
  'LEGS',
  'SHIELD',
  'RING',
  'AMULET',
  'MISC',
]);
export const rarityEnum = pgEnum('rarity_enum', ['COMMON', 'MAGIC', 'EPIC', 'RARE', 'LEGENDARY']);
export const weaponHandEnum = pgEnum('weapon_hand_enum', ['ONE_HANDED', 'TWO_HANDED']);

export const gameItemTable = pgTable('game_item', {
  id: text().primaryKey().notNull(),

  type: gameItemEnum().notNull(),
  weaponHand: weaponHandEnum(), 
  name: text().notNull(),
  image: text().notNull(),
  price: integer().default(0).notNull(),
  duration: integer().default(0).notNull(),

  modifierId: text()
    .notNull()
    .references(() => modifierTable.id, {
      onDelete: 'cascade'
    }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),
});

export const gameItemRelations = relations(gameItemTable, ({  one }) => ({
 
  modifier: one(modifierTable, {
    fields: [gameItemTable.modifierId],
    references: [modifierTable.id],
  }),
}));
