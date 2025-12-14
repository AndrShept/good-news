import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const skillsTypeEnum = pgEnum('skill_type_enum', ['BLACKSMITHING', 'MINING', 'SMELTING', 'ALCHEMY']);

export const skillTable = pgTable('skill', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: text().notNull(),
  type: skillsTypeEnum().notNull(),
  level: integer().notNull().default(1),
  currentExperience: integer().notNull().default(0),
  heroId: uuid()
    .references(() => heroTable.id, { onDelete: 'cascade' })
    .notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const skillTableRelations = relations(skillTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [skillTable.heroId],
    references: [heroTable.id],
  }),
}));
