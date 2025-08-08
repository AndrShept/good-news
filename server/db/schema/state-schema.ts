import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const stateTypeEnum = pgEnum('state_type_enum', ['IDLE', 'CHARACTER', 'SKILLS']);

export const stateTable = pgTable('state', {
  id: uuid().primaryKey().defaultRandom(),
  type: stateTypeEnum()
    .$defaultFn(() => 'IDLE')
    .notNull(),
  startedAt: timestamp('started_at', {
    mode: 'string',
  }).defaultNow(),
  completedAt: timestamp('completed_at', {
    mode: 'string',
  }).notNull().defaultNow(),
});

export const stateTableRelations = relations(stateTable, ({ one, many }) => ({
  heroes: many(heroTable),
}));
