import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

import { userTable } from './auth-schema';
import { modifier } from './modifier-schema';

export const hero = pgTable('hero', {
  id: text().primaryKey().notNull(),
  name: text().notNull().unique(),
  image: text().notNull(),
  level: integer().default(1),
  goldCoins: integer().default(100),
  premiumCoins: integer().default(0),
  isInBattle: boolean().default(false),
  isInDungeon: boolean().default(false),

  currentStatPoints: integer().default(10),
  freeStatPoints: integer().default(0),

  currentHealth: integer().default(100),
  currentMana: integer().default(100),
  maxHealth: integer().default(100),
  maxMana: integer().default(100),

  inventorySlotCount: integer().default(40),
  inventorySlotMax: integer().default(40),

  currentExperience: integer().default(0),
  maxExperience: integer().default(100),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp('updated_at', {
    mode: 'string',
  }),

  modifierId: text().references(() => modifier.id, {
    onDelete: 'cascade',
  }),
  userId: text()
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),
});

export const heroRelations = relations(hero, ({ one }) => ({
  modifier: one(modifier, {
    fields: [hero.modifierId],
    references: [modifier.id],
  }),
  user: one(userTable, {
    fields: [hero.userId],
    references: [userTable.id],
  }),
}));
