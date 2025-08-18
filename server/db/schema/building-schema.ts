import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const buildingNameTypeEnum = pgEnum('building_name_type_enum', ['MAGIC-SHOP', 'TEMPLE']);

export const buildingTable = pgTable('building', {
  id: uuid().primaryKey().defaultRandom(),

  name: buildingNameTypeEnum().notNull(),

  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const buildingTableTableRelations = relations(buildingTable, ({ many }) => ({}));
