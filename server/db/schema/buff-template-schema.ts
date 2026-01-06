import type { OmitModifier } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';

export const buffTypeEnum = pgEnum('buff_type_enum', ['POSITIVE', 'NEGATIVE']);

export const buffTemplateTable = pgTable('buff_template', {
  id: uuid().primaryKey().notNull(),
  name: text().notNull(),
  image: text().notNull(),
  duration: integer().notNull(),
  type: buffTypeEnum().notNull(),
  modifier: jsonb('modifier').$type<Partial<OmitModifier>>().notNull(),

});

// export const buffRelations = relations(buffTable, ({}) => ({
//   hero: one(heroTable, {
//     fields: [buffTable.heroId],
//     references: [heroTable.id],
//   }),
// }));
