import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { buildingNameTypeEnum } from './building-schema';
import { heroTable } from './hero-schema';
import { tileTable } from './tile-schema';
import { townTable } from './town-schema';

export const locationTable = pgTable('location', {
  id: uuid().primaryKey().defaultRandom(),

  townId: uuid().references(() => townTable.id, {
    onDelete: 'set null',
  }),
  heroId: uuid().references(() => heroTable.id, {
    onDelete: 'cascade',
  }),
  tileId: uuid().references(() => tileTable.id, { onDelete: 'set null' }),
  currentBuilding: buildingNameTypeEnum(),
  createdAt: timestamp({
    mode: 'string',
  }).defaultNow(),
});

export const locationTableRelations = relations(locationTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [locationTable.heroId],
    references: [heroTable.id],
  }),

  town: one(townTable, {
    fields: [locationTable.townId],
    references: [townTable.id],
  }),
  tile: one(tileTable, {
    fields: [locationTable.tileId],
    references: [tileTable.id],
  }),
}));
