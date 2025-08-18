import { relations } from 'drizzle-orm';
import { boolean, integer, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';


export const townNameTypeEnum = pgEnum('town_name_type_enum', ['SOLMERE']);

export const townTable = pgTable('town', {
  id: uuid().primaryKey().defaultRandom(),

  name: townNameTypeEnum().notNull(),

  createdAt: timestamp({
    mode: 'string',
  })
    .defaultNow()
    .notNull(),
});

export const townTableRelations = relations(townTable, ({ many }) => ({


}));
