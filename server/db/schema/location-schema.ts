import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const locationTypeEnum = pgEnum('location_type_enum', ['TOWN', 'MAP']);
export const buildingTypeEnum = pgEnum('building', ['MAGIC-SHOP', 'MINE-ENTRANCE', 'NONE', 'SHOP', 'TEMPLE', 'TOWN-HALL', 'LEAVE-TOWN']);

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),
  type: locationTypeEnum()
    .$defaultFn(() => 'TOWN')
    .notNull(),
  buildingType: buildingTypeEnum()
    .$defaultFn(() => 'NONE')
    .notNull(),
  x: integer(),
  y: integer(),
  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const locationTableRelations = relations(locationTable, ({ one, many }) => ({
  heroes: many(heroTable),
}));
