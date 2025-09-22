import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const actionTypeEnum = pgEnum('action_type_enum', ['WALK', 'CRAFT', 'IDLE']);

export const actionTable = pgTable('action', {
  id: uuid().primaryKey().defaultRandom(),
  type: actionTypeEnum()
    .$defaultFn(() => 'IDLE')
    .notNull(),
  heroId: uuid().references(() => heroTable.id, {
    onDelete: 'cascade',
  }).notNull(),
  startedAt: timestamp('started_at', {
    mode: 'string',
  }).defaultNow(),
  completedAt: timestamp('completed_at', {
    mode: 'string',
  }).notNull(),
});

export const actionTableRelations = relations(actionTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [actionTable.heroId],
    references: [heroTable.id],
  }),
}));
