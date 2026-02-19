import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const modifierTable = pgTable('modifier', {
  id: uuid().primaryKey().defaultRandom().notNull(),

  maxDamage: integer().default(0).notNull(),
  minDamage: integer().default(0).notNull(),

  strength: integer().default(0).notNull(),
  dexterity: integer().default(0).notNull(),
  intelligence: integer().default(0).notNull(),
  wisdom: integer().default(0).notNull(),
  constitution: integer().default(0).notNull(),
  luck: integer().default(0).notNull(),

  maxHealth: integer().default(0).notNull(),
  maxMana: integer().default(0).notNull(),

  manaRegen: integer().default(0).notNull(),
  healthRegen: integer().default(0).notNull(),

  armor: integer().default(0).notNull(),
  magicResistance: integer().default(0).notNull(),
  evasion: integer().default(0).notNull(),

  spellDamage: integer().default(0).notNull(),
  spellCritDamage: integer().default(0).notNull(),
  spellCritRating: integer().default(0).notNull(),
  spellHitRating: integer().default(0).notNull(),
  spellPenetration: integer().default(0).notNull(),

  physDamage: integer().default(0).notNull(),
  physCritDamage: integer().default(0).notNull(),
  physCritRating: integer().default(0).notNull(),
  physHitRating: integer().default(0).notNull(),
  physPenetration: integer().default(0).notNull(),

  heroId: uuid().references(() => heroTable.id, {
    onDelete: 'cascade',
  }),
});

export const modifierRelations = relations(modifierTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [modifierTable.heroId],
    references: [heroTable.id],
  }),
}));
