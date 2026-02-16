import type { ActiveSkillTraining, IHeroStat, THeroRegen, TLocation } from '@/shared/types';
import { relations } from 'drizzle-orm';
import { boolean, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

import { userTable } from './auth-schema';
import { buffInstanceTable } from './buff-instance-schema';
import { groupTable } from './group-schema';
import { itemContainerTable } from './item-container-schema';
import { locationTable } from './location-schema';
import { modifierTable } from './modifier-schema';

export const stateTypeEnum = pgEnum('state_type_enum', [
  'IDLE',
  'BATTLE',
  'BLACKSMITHING',
  'ALCHEMY',
  'FISHING',
  'LUMBERJACKING',
  'GATHERING',
  'MINING',
  'SMELTING',
  'TAILORING',
  'WALK',
]);

export const heroTable = pgTable('hero', {
  id: uuid().primaryKey().notNull(),
  name: text().notNull().unique(),
  avatarImage: text().notNull(),
  characterImage: text().notNull(),
  level: integer().default(1).notNull(),
  goldCoins: integer().default(100).notNull(),
  premiumCoins: integer().default(0).notNull(),
  isOnline: boolean().default(true).notNull(),
  maxQueueCraftCount: integer().default(4).notNull(),
  state: stateTypeEnum().default('IDLE').notNull(),
  freeStatPoints: integer().default(10).notNull(),

  currentHealth: integer().default(100).notNull(),
  currentMana: integer().default(100).notNull(),
  maxHealth: integer().default(0).notNull(),
  maxMana: integer().default(0).notNull(),
  stat: jsonb('stat').$type<IHeroStat>().notNull(),
  regen: jsonb('regen').$type<THeroRegen>().notNull(),
  activeSkillTraining: jsonb('activeSkillTraining ').$type<ActiveSkillTraining>(),

  groupId: uuid().references(() => groupTable.id, {
    onDelete: 'set null',
  }),
  userId: text()
    .notNull()
    .references(() => userTable.id, {
      onDelete: 'cascade',
    }),

  createdAt: timestamp('created_at', {
    withTimezone: true,
    mode: 'string',
  })
    .notNull()
    .defaultNow(),
});

export const heroRelations = relations(heroTable, ({ one, many }) => ({
  modifier: one(modifierTable),
  location: one(locationTable),
  group: one(groupTable, {
    fields: [heroTable.groupId],
    references: [groupTable.id],
  }),
  user: one(userTable, {
    fields: [heroTable.userId],
    references: [userTable.id],
  }),

  buffs: many(buffInstanceTable),
  itemContainers: many(itemContainerTable),
}));
