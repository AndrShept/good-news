import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { InferResponseType } from 'hono';
import { z } from 'zod';

import type { client } from '../frontend/src/lib/utils';
import {
  actionTable,
  actionTypeEnum,
  armorTable,
  craftItemTable,
  groupTable,
  heroTable,
  inventoryItemTable,
  locationTable,
  mapTable,
  modifierTable,
  placeTable,
  potionTable,
  pvpModeTypeEnum,
  weaponTable,
} from '../server/db/schema';
import { userTable } from '../server/db/schema/auth-schema';
import { buffTable } from '../server/db/schema/buff-schema';
import { commentTable } from '../server/db/schema/comments-schema';
import { equipmentTable, slotEnum } from '../server/db/schema/equipment-schema';
import {
  accessoryTable,
  armorSlotEnum,
  gameItemEnum,
  gameItemTable,
  weaponHandEnum,
  weaponTypeEnum,
} from '../server/db/schema/game-item-schema';
import { postTable } from '../server/db/schema/posts-schema';
import type { rarityEnum, resourceCategoryEnum, resourceTable, resourceTypeEnum } from '../server/db/schema/resource-schema';
import { stateTable, stateTypeEnum } from '../server/db/schema/state-schema';
import { tileTable, tileTypeEnum } from '../server/db/schema/tile-schema';
import type { Layer } from './json-types';

export type SuccessResponse<T = undefined> = {
  success: true;
  message: string;
  data?: T;
};
export type SocketResponse = {
  success: boolean;
  message: string;
};
export type ErrorResponse = {
  success: false;
  message: string;
  canShow?: boolean;
};
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3).max(255),
});
export const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(3).max(255),
    username: z
      .string()
      .min(3)
      .max(31)
      .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  })
  .refine((val) => val.password === val.confirmPassword, {
    message: 'Passwords must match!',
    path: ['confirmPassword'],
  });

export const createPostSchema = createInsertSchema(postTable, {
  title: z.string().min(3),
  content: z.string().min(3).optional().or(z.literal('')),
  url: z.string().trim().url({ message: 'URL must be a valid URL' }).optional().or(z.literal('')),
})
  .pick({
    title: true,
    content: true,
    url: true,
  })
  .superRefine((data, ctx) => {
    if (!data.url && !data.content) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either URL or Content must be provided',
        path: ['url'],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Either URL or Content must be provided',
        path: ['content'],
      });
    }
  });

const insertCommentSchema = createInsertSchema(commentTable, {
  content: z.string().min(1).trim(),
});

export const createCommentSchema = insertCommentSchema.pick({
  content: true,
});

export const sortBySchema = z.enum(['points', 'recent']);
export const orderSchema = z.enum(['asc', 'desc']);
export type SortBy = z.infer<typeof sortBySchema>;
export type Order = z.infer<typeof orderSchema>;

export const paginationSchema = z.object({
  limit: z
    .number({
      coerce: true,
    })
    .optional()
    .default(8),
  page: z
    .number({
      coerce: true,
    })
    .optional()
    .default(1),
  sortBy: sortBySchema.optional().default('recent'),
  order: orderSchema.optional().default('asc'),
  author: z.optional(z.string()),
  site: z.string().optional(),
});
export type IPaginationSchema = z.infer<typeof paginationSchema>;
export type User = Omit<typeof userTable.$inferSelect, 'password_hash'>;
export type Post = InferSelectModel<typeof postTable> & {
  author?: Omit<User, 'password_hash'>;
  isUpvoted?: boolean;
};
export type Comments = InferSelectModel<typeof commentTable> & {
  childComments?: Comments[];
  author?: User;
  isUpvoted?: boolean;
};

export type PaginatedResponse<T> = {
  pagination: {
    page: number;
    totalPages: number;
    isMore?: boolean;
  };
  data: T;
} & Omit<SuccessResponse, 'data'>;

export type GetPostsData = InferResponseType<typeof client.post.$get>;

export type EquipmentSlotType = (typeof slotEnum.enumValues)[number];
export type GameItemType = (typeof gameItemEnum.enumValues)[number];
export type ArmorType = (typeof armorSlotEnum.enumValues)[number];
export type RarityType = (typeof rarityEnum.enumValues)[number];
export type WeaponHandType = (typeof weaponHandEnum.enumValues)[number];
export type WeaponType = (typeof weaponTypeEnum.enumValues)[number];
export type ActionType = (typeof actionTypeEnum.enumValues)[number];
export type TileType = (typeof tileTypeEnum.enumValues)[number];
export type PvpModeType = (typeof pvpModeTypeEnum.enumValues)[number];
export type StateType = (typeof stateTypeEnum.enumValues)[number];
export type ResourceType = (typeof resourceTypeEnum.enumValues)[number];
export type ResourceCategoryType = (typeof resourceCategoryEnum.enumValues)[number];

export type Modifier = InferSelectModel<typeof modifierTable>;
export type Group = InferSelectModel<typeof groupTable>;
export type State = InferSelectModel<typeof stateTable>;
export type Action = InferSelectModel<typeof actionTable> & { timeRemaining: number };
export type Location = InferSelectModel<typeof locationTable> & {
  map?: Map;
  place?: Place;
  hero?: Hero;
};

export type Place = InferSelectModel<typeof placeTable> & {
  buildings?: Building[] | null;
};

export const buildingTypeValues = ['MAGIC-SHOP', 'TEMPLE'] as const;

export type BuildingType = (typeof buildingTypeValues)[number];

export type Building = {
  id: string;
  name: string;
  type: BuildingType;
  image: string;
};

export type Map = typeof mapTable.$inferSelect & {
  places?: Place[];
  layers?: Layer[];
};
export type Tile = typeof tileTable.$inferSelect & {
  map?: Map;
  place?: Place;
  location?: Location;
};
export type TilesGrid = (Tile | null)[][];
export type OmitModifier = Omit<Modifier, 'id' | 'createdAt' | 'updatedAt' | 'heroId' | 'resourceId'>;

export type Equipment = typeof equipmentTable.$inferSelect & {
  gameItem?: GameItem;
};
export type InventoryItem = InferSelectModel<typeof inventoryItemTable> & {
  gameItem: GameItem;
};

export type Weapon = typeof weaponTable.$inferSelect;
export type Armor = typeof armorTable.$inferSelect;
export type Potion = typeof potionTable.$inferSelect;
export type Accessory = typeof accessoryTable.$inferSelect;
export type Resource = typeof resourceTable.$inferSelect & {
  gameItem?: GameItem | null;
  modifier?: Modifier | null;
};

export type CraftItem = typeof craftItemTable.$inferSelect & {
  gameItem?: GameItem | null;
};

export type GroupCraftItem = { itemType: GameItemType; subgroups: { subtype: WeaponType; items: CraftItem[] }[] };

export type GameItem = InferSelectModel<typeof gameItemTable> & {
  weapon?: Weapon | null;
  armor?: Armor | null;
  potion?: Potion | null;
  accessory?: Accessory | null;
  resource?: Resource | null;
};

export type Hero = InferSelectModel<typeof heroTable> & {
  modifier?: Modifier;
  group?: Group;
  action?: Action;
  location?: Location;
  state?: State;
  equipments?: Equipment[];
};
export type Buff = typeof buffTable.$inferSelect;

export type IPosition = {
  x: number;
  y: number;
};

//API RESPONSE
export type ApiHeroResponse = InferResponseType<typeof client.hero.$get>;
export type ApiMapResponse = InferResponseType<(typeof client.map)[':id']['$get']>['data'];
export type ApiGroupMembersResponse = InferResponseType<(typeof client.group)[':id']['heroes']['$get']>;

export type ApiGetCraftItemResponse = InferResponseType<(typeof client)['craft-item']['$get']>['data'];

export type IHeroStat = {
  strength: number;
  constitution: number;
  intelligence: number;
  dexterity: number;
  luck: number;
};
export type IHeroStatEnum = keyof IHeroStat;

export const statsSchema = createSelectSchema(modifierTable, {
  strength: z.number(),
  constitution: z.number(),
  intelligence: z.number(),
  dexterity: z.number(),
  luck: z.number(),
}).pick({
  constitution: true,
  dexterity: true,
  luck: true,
  intelligence: true,
  strength: true,
});
export const createHeroSchema = createInsertSchema(heroTable, {
  name: z
    .string()
    .min(3)
    .max(20)
    .regex(/^[a-zA-Z0-9_]+$/, 'hero name can only contain letters, numbers, and underscores'),
  freeStatPoints: z.number(),
  avatarImage: z.string().min(1),
  // characterImage: z.string().min(1),
})
  .pick({
    name: true,
    avatarImage: true,
    freeStatPoints: true,
    characterImage: true,
  })
  .extend({
    stat: z.object({
      constitution: z.number(),
      dexterity: z.number(),
      luck: z.number(),
      intelligence: z.number(),
      strength: z.number(),
    }),
  });
export const changeStatSchema = statsSchema.extend({
  freeStatPoints: z.number(),
});
