import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const craftRecipeTable = pgTable('craft_recipe', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  heroId: uuid().references(() => heroTable.id, {
    onDelete: 'set null',
  }),
  itemTemplateId: uuid(),
  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});
