import { relations } from 'drizzle-orm';
import { integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { heroTable } from './hero-schema';
import { itemContainerTable } from './item-container-schema';
import { itemTemplateTable } from './item-template-schema';

export const itemLocationEnum = pgEnum('item_location_enum', ['BANK', 'BACKPACK', 'EQUIPMENT', 'LOOT', 'MARKET']);
export const rarityEnum = pgEnum('rarity_enum', ['COMMON', 'MAGIC', 'EPIC', 'RARE', 'LEGENDARY']);
export const slotEnum = pgEnum('equipment_slot_enum', [
  'RIGHT_HAND',
  'LEFT_HAND',
  'HELMET',
  'CHEST',
  'LEGS',
  'BOOTS',
  'GLOVES',
  'AMULET',
  'RING_LEFT',
  'RING_RIGHT',
  'BELT',
]);
export const itemInstanceTable = pgTable('item_instance', {
  id: uuid().primaryKey().defaultRandom().notNull(),
  ownerHeroId: uuid().references(() => heroTable.id, { onDelete: 'cascade' }),
  itemContainerId: uuid().references(() => itemContainerTable.id, { onDelete: 'cascade' }),
  itemTemplateId: uuid().references(() => itemTemplateTable.id, { onDelete: 'cascade' }),
  location: itemLocationEnum().notNull(),
  slot: slotEnum(),
  marketPrice: integer(),
  durability: integer(),
  quantity: integer().default(1).notNull(),
  createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const itemInstanceRelations = relations(itemInstanceTable, ({ one }) => ({
  hero: one(heroTable, {
    fields: [itemInstanceTable.ownerHeroId],
    references: [heroTable.id],
  }),
  itemContainer: one(itemContainerTable, {
    fields: [itemInstanceTable.itemContainerId],
    references: [itemContainerTable.id],
  }),
  itemTemplate: one(itemTemplateTable, {
    fields: [itemInstanceTable.itemTemplateId],
    references: [itemTemplateTable.id],
  }),
}));
