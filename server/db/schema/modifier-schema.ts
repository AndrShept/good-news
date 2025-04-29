import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const modifier = pgTable('modifier', {
  id: text().primaryKey().notNull(),

  maxDamage: integer().default(0).notNull(),
  minDamage: integer().default(0).notNull(),

  strength: integer().default(10).notNull(),
  dexterity: integer().default(10).notNull(),
  intelligence: integer().default(10).notNull(),
  constitution: integer().default(10).notNull(),
  luck: integer().default(5).notNull(),

  manaRegeneration: integer().default(0).notNull(),
  healthRegeneration: integer().default(0).notNull(),

  armor: integer().default(0).notNull(),
  magicResistances: integer().default(0).notNull(),
  evasion: integer().default(0).notNull(),

  spellDamage: integer().default(0).notNull(),
  spellDamageCritPower: integer().default(0).notNull(),
  spellDamageCritChance: integer().default(0).notNull(),

  meleeDamage: integer().default(0).notNull(),
  meleeDamageCritPower: integer().default(0).notNull(),
  meleeDamageCritChance: integer().default(0).notNull(),



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
