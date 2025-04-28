import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const modifier = pgTable('modifier', {
  id: text().primaryKey().notNull(),

  minDamage: integer().default(0),
  maxDamage: integer().default(0),

  strength: integer().default(0),
  dexterity: integer().default(0),
  intelligence: integer().default(0),
  constitution: integer().default(0),
  luck: integer().default(0),

  manaRegeneration: integer().default(0),
  healthRegeneration: integer().default(0),

  armor: integer().default(0),
  magicResistances: integer().default(0),
  evasion: integer().default(0),

  spellDamage: integer().default(0),
  spellDamageCritPower: integer().default(0),
  spellDamageCritChance: integer().default(0),

  meleeDamage: integer().default(0),
  meleeDamageCritPower: integer().default(0),
  meleeDamageCritChance: integer().default(0),



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
