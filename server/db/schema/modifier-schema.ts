import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { resourceTable } from './resource-schema';

export const modifierTable = pgTable('modifier', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  maxDamage: integer().default(0).notNull(),
  minDamage: integer().default(0).notNull(),

  strength: integer().default(0).notNull(),
  dexterity: integer().default(0).notNull(),
  intelligence: integer().default(0).notNull(),
  constitution: integer().default(0).notNull(),
  luck: integer().default(0).notNull(),

  maxHealth: integer().default(0).notNull(),
  maxMana: integer().default(0).notNull(),

  manaRegen: integer().default(0).notNull(),
  healthRegen: integer().default(0).notNull(),

  defense: integer().default(0).notNull(),
  magicResistance: integer().default(0).notNull(),
  evasion: integer().default(0).notNull(),

  spellDamage: integer().default(0).notNull(),
  spellCritPower: integer().default(0).notNull(),
  spellCritChance: integer().default(0).notNull(),
  spellHitChance: integer().default(0).notNull(),

  physDamage: integer().default(0).notNull(),
  physCritPower: integer().default(0).notNull(),
  physCritChance: integer().default(0).notNull(),
  physHitChance: integer().default(0).notNull(),

  heroId: uuid().references(() => heroTable.id, {
    onDelete: 'cascade',
  }),
  resourceId: uuid().references(() => resourceTable.id, {
    onDelete: 'cascade',
  }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const modifierRelations = relations(modifierTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [modifierTable.heroId],
    references: [heroTable.id],
  }),
  resource: one(resourceTable, {
    fields: [modifierTable.resourceId],
    references: [resourceTable.id],
  }),
}));
