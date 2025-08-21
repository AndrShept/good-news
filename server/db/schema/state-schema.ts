import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const stateTypeEnum = pgEnum('state_type_enum', ['CHARACTER', 'SKILLS', 'IDLE']);

export const stateTable = pgTable('state', {
  id: uuid().primaryKey().defaultRandom(),
  type: stateTypeEnum().notNull(),

  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const stateTableRelations = relations(stateTable, ({ many }) => ({
  heroes: many(heroTable),
}));
