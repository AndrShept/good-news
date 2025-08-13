import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingTypeEnum } from './location-schema';
import { tileTable } from './tile-schema';

export const townNameTypeEnum = pgEnum('town_name_type_enum', ['SOLMERE']);
export const townTable = pgTable('town', {
  id: uuid().primaryKey().defaultRandom(),
  buildingType: buildingTypeEnum()
    .$defaultFn(() => 'NONE')
    .notNull(),
  name: townNameTypeEnum().notNull(),
  image: text().notNull(),
  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const townTableRelations = relations(townTable, ({ many }) => ({
  tiles: many(tileTable),
}));
