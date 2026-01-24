import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import type { InferResponseType } from 'hono';
import { z } from 'zod';

import type { client } from '../frontend/src/lib/utils';
import {
  buffInstanceTable,
  craftRecipeTable,
  groupTable,
  heroTable,
  itemContainerTable,
  itemContainerTypeEnum,
  itemLocationEnum,
  modifierTable,
  stateTypeEnum,
} from '../server/db/schema';
import { userTable } from '../server/db/schema/auth-schema';
import { commentTable } from '../server/db/schema/comments-schema';
import type { itemInstanceTable, rarityEnum, slotEnum } from '../server/db/schema/item-instance-schema';
import type {
  armorCategoryEnum,
  armorTypeEnum,
  coreMaterialTypeEnum,
  ingotTypeEnum,
  itemTemplateEnum,
  leatherTypeEnum,
  oreTypeEnum,
  resourceCategoryEnum,
  resourceTypeEnum,
  weaponHandEnum,
  weaponTypeEnum,
} from '../server/db/schema/item-instance-schema';
import type { locationTable } from '../server/db/schema/location-schema';
import { postTable } from '../server/db/schema/posts-schema';
import type { queueCraftItemTable, queueCraftStatusEnum } from '../server/db/schema/queue-craft-item-schema';
import type { skillInstanceTable } from '../server/db/schema/skill-instance-schema';
import type { Layer } from './json-types';
import type { SkillKey } from './templates/skill-template';

export interface SuccessResponse<T = undefined> {
  success: true;
  message: string;
  data?: T;
}

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

export type PathNode = { x: number; y: number; mapId: string; completedAt: number };

export type GetPostsData = InferResponseType<typeof client.post.$get>;

export type EquipmentSlotType = (typeof slotEnum.enumValues)[number];
export type ItemTemplateType = (typeof itemTemplateEnum.enumValues)[number];
export type ArmorType = (typeof armorTypeEnum.enumValues)[number];
export type ArmorCategoryType = (typeof armorCategoryEnum.enumValues)[number];
export type RarityType = (typeof rarityEnum.enumValues)[number];
export type WeaponHandType = (typeof weaponHandEnum.enumValues)[number];
export type WeaponType = (typeof weaponTypeEnum.enumValues)[number];
export type StateType = (typeof stateTypeEnum.enumValues)[number];
export type ResourceType = (typeof resourceTypeEnum.enumValues)[number];
export type OreType = (typeof oreTypeEnum.enumValues)[number];
export type LeatherType = (typeof leatherTypeEnum.enumValues)[number];
export type IngotType = (typeof ingotTypeEnum.enumValues)[number];
export type CoreMaterialType = (typeof coreMaterialTypeEnum.enumValues)[number];
export type ResourceCategoryType = (typeof resourceCategoryEnum.enumValues)[number];
export type QueueCraftStatusType = (typeof queueCraftStatusEnum.enumValues)[number];
export type ItemContainerType = (typeof itemContainerTypeEnum.enumValues)[number];

export type Modifier = InferSelectModel<typeof modifierTable>;
export type Group = InferSelectModel<typeof groupTable>;
export type TLocation = typeof locationTable.$inferSelect;
export type QueueCraftItem = typeof queueCraftItemTable.$inferSelect & {
  craftItem?: ItemTemplate | null;
};

export const placeValues = ['TOWN', 'DUNGEON', 'MINE'] as const;
export type PlaceType = (typeof placeValues)[number];

export type TPlace = {
  id: string;
  type: PlaceType;
  name: string;
  image: string;
  x: number;
  y: number;
  mapId: string;
  buildings: Building[];
};

export const buildingValues = ['MAGIC-SHOP', 'TEMPLE', 'BLACKSMITH', 'FORGE', 'BANK'] as const;
export const tileTypeValues = ['OBJECT', 'WATER', 'GROUND'] as const;
export type BuildingType = (typeof buildingValues)[number];

export type Building = {
  id: string;
  name: string;
  type: BuildingType;
  workingResourceCategory?: ResourceCategoryType;
  image: string;
};

export type TileType = (typeof tileTypeValues)[number];

export type TMap = {
  id: string;
  width: number;
  height: number;
  tileHeight: number;
  tileWidth: number;
  image: string;
  name: string;
  places: TPlace[];
  layers: Layer[];
};

export type OmitModifier = Omit<Modifier, 'id' | 'heroId'>;

export type TItemContainer = typeof itemContainerTable.$inferSelect & {
  itemsInstance: ItemInstance[];
};

export type RecipeTemplate = {
  id: string;

  itemTemplateId: string;

  timeMs: number;
  requirement: {
    resources: { templateId: string; amount: number }[];
    skills: { skillId: string; level: number }[];
    building: BuildingType;
    category: ResourceCategoryType;
  };

  defaultUnlocked: boolean;
};

export type CraftItem = RecipeTemplate;

// export type CraftInfo = { baseResourceCategory: ResourceCategoryType; requiredBuildingType: BuildingType, requirement: CraftItemRequirement };

// export type CraftItemRequirement = {
//   resources: { id: string; amount: number }[];
//   skills: { id: string; level: number }[];
//   timeMs: number;
// };

export type TEquipInfo = {
  weaponType?: WeaponType;
  weaponHand?: WeaponHandType;
  armorType?: ArmorType;
  armorCategory?: ArmorCategoryType;
};
export type TResourceInfo = {
  category: ResourceCategoryType;
};
export type TPotionInfo = {
  type: 'BUFF' | 'RESTORE';
  restore?: { health?: number; mana?: number };
  buffTemplateId?: string;
};

export type ItemLocationType = (typeof itemLocationEnum.enumValues)[number];

export type ItemInstance = typeof itemInstanceTable.$inferSelect;
export type ItemTemplate = {
  id: string;
  type: ItemTemplateType;
  name: string;
  image: string;
  key: string;
  stackable: boolean;
  maxStack?: number;
  buyPrice?: number;

  equipInfo?: TEquipInfo;
  resourceInfo?: TResourceInfo;
  potionInfo?: TPotionInfo;
  coreModifier?: Partial<OmitModifier>;
};

export type BuffInstance = typeof buffInstanceTable.$inferSelect;
export type BuffTemplate = {
  id: string;
  name: string;
  image: string;
  type: 'POSITIVE' | 'NEGATIVE';
  duration: number;
  modifier: Partial<OmitModifier>;
};

export type Hero = InferSelectModel<typeof heroTable> & {
  modifier: Modifier;
  location: TLocation;
  group: Group;
  buffs: BuffInstance[];
  equipments: ItemInstance[];
  // queueCraftItems?: QueueCraftItem[];
  itemContainers: { id: string; type: ItemContainerType; name: string }[];
};

export type HeroSidebarItem = {
  id: string;
  name: string;
  level: number;
  state: StateType;
  avatarImage: string;
};
export type MapHero = HeroSidebarItem & {
  characterImage: string;
  x: number;
  y: number;
};

export type SkillInstance = typeof skillInstanceTable.$inferSelect;

export type SkillTemplate = {
  id: string;
  name: string;
  image: string;
  key: SkillKey;
};

export type IPosition = {
  x: number;
  y: number;
};

//API RESPONSE
export type ApiGetHeroResponse = InferResponseType<(typeof client.hero)['$get']>['data'];
export type ApiMapResponse = InferResponseType<(typeof client.map)[':id']['$get']>['data'];
export type ApiGetMapHeroes = InferResponseType<(typeof client.map)[':id']['heroes']['$get']>['data'];
export type ApiGetPlaceHeroes = InferResponseType<(typeof client.place)[':id']['heroes']['$get']>['data'];
export type ApiGroupMembersResponse = InferResponseType<(typeof client.group)[':id']['heroes']['$get']>;
export type ApiGetCraftItemsResponse = InferResponseType<(typeof client.craft.items)[':buildingType']['$get']>['data'];

// export type ApiGetCraftItemResponse = InferResponseType<(typeof client)['craft']['items'][':buildingType']['$get']>['data'];
export type ApiGetShopItemTemplateResponse = InferResponseType<(typeof client)['shop'][':buildingType']['$get']>['data'];

export type IHeroStat = {
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  constitution: number;
  luck: number;
};
export type THeroRegen = {
  healthAcc: number,
  manaAcc: number,
  healthTimeMs: number,
  manaTimeMs: number,
};
export type IHeroStatEnum = keyof IHeroStat;

export const statsSchema = createSelectSchema(modifierTable, {
  strength: z.number(),
  constitution: z.number(),
  intelligence: z.number(),
  dexterity: z.number(),
  luck: z.number(),
  wisdom: z.number(),
}).pick({
  constitution: true,
  dexterity: true,
  wisdom: true,
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
      wisdom: z.number(),
      luck: z.number(),
      intelligence: z.number(),
      strength: z.number(),
    }),
  });
export const changeStatSchema = statsSchema.extend({
  freeStatPoints: z.number(),
});

export const buyItemsSchema = z.object({
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        quantity: z.number().int().positive(),
      }),
    )
    .refine((items) => new Set(items.map((i) => i.id)).size === items.length, { message: 'Duplicate item id' }),
});
