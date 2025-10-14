import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { actionTable } from './action-schema';
import { userTable } from './auth-schema';
import { buffTable } from './buff-schema';
import { equipmentTable } from './equipment-schema';
import { groupTable } from './group-schema';
import { inventoryItemTable } from './inventory-item-schema';
import { locationTable } from './location-schema';
import { modifierTable } from './modifier-schema';
import { stateTable } from './state-schema';
import type { IHeroStat } from '@/shared/types';

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
  stat: jsonb('stat').$type<IHeroStat>(),

  groupId: uuid().references(() => groupTable.id, {
    onDelete: 'set null',
  }),
  userId: text()
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const heroRelations = relations(heroTable, ({ one, many }) => ({
  modifier: one(modifierTable),
  action: one(actionTable),
  state: one(stateTable),
  location: one(locationTable),
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
