import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { townsToBuildingsTable } from './town-schema';

export const buildingNameTypeEnum = pgEnum('building_name_type_enum', ['MAGIC-SHOP', 'TEMPLE']);

export const buildingTable = pgTable('building', {
  id: uuid().primaryKey().defaultRandom(),

  name: buildingNameTypeEnum().notNull(),
  image: text().notNull(),
  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const buildingTableTableRelations = relations(buildingTable, ({ many }) => ({
  towns: many(townsToBuildingsTable),
}));
