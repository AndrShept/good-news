import { relations } from 'drizzle-orm';
import { integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { containerSlotTable } from './container-slot-schema';
import { heroTable } from './hero-schema';
import { placeTable } from './place-schema';

export const itemContainerTypeEnum = pgEnum('item_container_type_enum', ['BACKPACK', 'BANK']);

export const itemContainerTable = pgTable('item_container', {
  id: uuid().defaultRandom().primaryKey(),
  heroId: uuid()
    .notNull()
    .references(() => heroTable.id, { onDelete: 'cascade' }),
  placeId: uuid().references(() => placeTable.id),
  type: itemContainerTypeEnum().notNull(),
  name: text().notNull(),
  color: text(),
  usedSlots: integer().default(0).notNull(),
  maxSlots: integer().default(40).notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const itemContainerTableRelations = relations(itemContainerTable, ({ one, many }) => ({
  hero: one(heroTable, {
    fields: [itemContainerTable.heroId],
    references: [heroTable.id],
  }),
  place: one(placeTable, {
    fields: [itemContainerTable.placeId],
    references: [placeTable.id],
  }),
  containerSlots: many(containerSlotTable),
}));
