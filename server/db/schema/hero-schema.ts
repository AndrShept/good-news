import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from './auth-schema';
import { buffTable } from './buff-schema';
import { equipmentTable } from './equipment-schema';
import { groupTable } from './group-schema';
import { inventoryItemTable } from './inventory-item-schema';
import { modifierTable } from './modifier-schema';

export const heroTable = pgTable('hero', {
  id: uuid().primaryKey().notNull(),
  name: text().notNull().unique(),
  avatarImage: text().notNull(),
  characterImage: text().notNull(),
  level: integer().default(1).notNull(),
  goldCoins: integer().default(100).notNull(),
  premiumCoins: integer().default(0).notNull(),
  isInBattle: boolean().default(false).notNull(),
  isInDungeon: boolean().default(false).notNull(),
  isOnline: boolean().default(true).notNull(),

  freeStatPoints: integer().default(10).notNull(),

  currentHealth: integer().default(100).notNull(),
  currentMana: integer().default(100).notNull(),
  maxHealth: integer().default(0).notNull(),
  maxMana: integer().default(0).notNull(),

  currentInventorySlots: integer().default(0).notNull(),
  maxInventorySlots: integer().default(40).notNull(),

  currentExperience: integer().default(0).notNull(),
  maxExperience: integer().default(100).notNull(),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),

  modifierId: uuid().references(() => modifierTable.id),
  groupId: uuid()
    .references(() => groupTable.id, {
      onDelete: 'set null',
    }),
  userId: text()
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),
});

export const heroRelations = relations(heroTable, ({ one, many }) => ({
  modifier: one(modifierTable, {
    fields: [heroTable.modifierId],
    references: [modifierTable.id],
  }),
  group: one(groupTable, {
    fields: [heroTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [heroTable.userId],
    references: [userTable.id],
  }),
  equipments: many(equipmentTable),
  inventoryItem: many(inventoryItemTable),
  buffs: many(buffTable),
}));
