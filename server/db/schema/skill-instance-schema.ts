import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const skillInstanceTable = pgTable('skill_instance', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  level: integer().notNull().default(1),
  currentExperience: integer().notNull().default(0),
  heroId: uuid()
    .references(() => heroTable.id, { onDelete: 'cascade' })
    .notNull(),
  skillTemplateId: uuid().notNull(),
  createdAt: timestamp('created_at', {
    mode: 'string',
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const skillTableRelations = relations(skillInstanceTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [skillInstanceTable.heroId],
    references: [heroTable.id],
  }),
}));
