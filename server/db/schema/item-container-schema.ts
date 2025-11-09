import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { containerSlotTable } from './container-slot-schema';

export const itemContainerTable = pgTable('item_container', {
  id: uuid().defaultRandom().primaryKey(),
  heroId: uuid().references(() => heroTable.id, { onDelete: 'cascade' }),
  type: text('type').$type<'backpack' | 'bank'>().notNull(),
  name: text().notNull(),
  usedSlots: integer().default(0).notNull(),
  maxSlots: integer().default(40).notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const itemContainerTableRelations = relations(itemContainerTable, ({ one, many }) => ({
  hero: one(heroTable, {
    fields: [itemContainerTable.heroId],
    references: [heroTable.id],
  }),
  containerSlots : many(containerSlotTable)

}));
