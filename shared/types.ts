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
import type {
  boneTypeEnum,
  clothTypeEnum,
  coreResourceTypeEnum,
  curedFurTypeEnum,
  fiberTypeEnum,
  flowerTypeEnum,
  furTypeEnum,
  herbTypeEnum,
  hideTypeEnum,
  itemInstanceTable,
  logTypeEnum,
  mushroomTypeEnum,
  plankTypeEnum,
  rarityEnum,
  slotEnum,
} from '../server/db/schema/item-instance-schema';
import type {
  armorCategoryEnum,
  armorTypeEnum,
  ingotTypeEnum,
  itemTemplateEnum,
  leatherTypeEnum,
  oreTypeEnum,
  resourceCategoryEnum,
  resourceTypeEnum,
  weaponHandEnum,
  weaponTypeEnum,
} from '../server/db/schema/item-instance-schema';
import { postTable } from '../server/db/schema/posts-schema';
import type { queueCraftItemTable, queueCraftStatusEnum } from '../server/db/schema/queue-craft-item-schema';
import type { skillInstanceTable } from '../server/db/schema/skill-instance-schema';
import type { HeroRuntime } from '../server/game/state/server-state';
import type { Layer } from './json-types';
import type { CreatureKey } from './templates/creature-template';
import type { SkillKey, skillCategoryValues } from './templates/skill-template';

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
export type IngotType = (typeof ingotTypeEnum.enumValues)[number];
export type HideType = (typeof hideTypeEnum.enumValues)[number];
export type LeatherType = (typeof leatherTypeEnum.enumValues)[number];
export type LogType = (typeof logTypeEnum.enumValues)[number];
export type PlankType = (typeof plankTypeEnum.enumValues)[number];
export type FurType = (typeof furTypeEnum.enumValues)[number];
export type CuredFurType = (typeof curedFurTypeEnum.enumValues)[number];
export type FiberType = (typeof fiberTypeEnum.enumValues)[number];
export type FlowerType = (typeof flowerTypeEnum.enumValues)[number];
export type HerbsType = (typeof herbTypeEnum.enumValues)[number];
export type MushroomType = (typeof mushroomTypeEnum.enumValues)[number];
export type ClothType = (typeof clothTypeEnum.enumValues)[number];
export type BoneType = (typeof boneTypeEnum.enumValues)[number];
export type CoreResourceType = (typeof coreResourceTypeEnum.enumValues)[number];
export type ResourceCategoryType = (typeof resourceCategoryEnum.enumValues)[number];
export type ColoredResourceCategoryType = Extract<ResourceCategoryType, 'INGOT' | 'LEATHER' | 'CLOTH' | 'PLANK' | 'BONE' | 'CURED_FUR'>;
export type ColoredResourceType =
  | OreType
  | IngotType
  | HideType
  | LeatherType
  | LogType
  | PlankType
  | FurType
  | CuredFurType
  | ClothType
  | BoneType;

export type QueueCraftStatusType = (typeof queueCraftStatusEnum.enumValues)[number];
export type ItemContainerType = (typeof itemContainerTypeEnum.enumValues)[number];

export type Modifier = InferSelectModel<typeof modifierTable>;
export type Group = InferSelectModel<typeof groupTable>;
export type TLocation = {
  placeId: string | null;
  mapId: string | null;
  chunkId: string | null;
  x: number;
  y: number;
  targetX: number | null;
  targetY: number | null;
};


export const placeEntranceValues = ['DUNGEON', 'MINE'] as const;
export type PlaceEntranceType = (typeof placeEntranceValues)[number];

export type Entrance = {
  id: string;
  key: string;
  image: string;
  minLevel?: number;
  targetPlaceId?: string;
  targetMapId?: string;
  x: number;
  y: number;
  targetX?: number;
  targetY?: number;
};

export type TMap = {
  id: string;
  width: number;
  height: number;
  tileHeight: number;
  tileWidth: number;
  offsetX: number;
  offsetY: number;
  image: string;
  name: string;
  layers: Layer[];
  places: TPlace[];
  entrances: Entrance[];
};

export type TPlace = {
  id: string;
  // type: PlaceType;
  name: string;
  image: string;
  x: number;
  y: number;
  mapId: string;
  buildings: Building[];
  entrances: Entrance[];
  itemContainers: { id: string; name: string; color: string | null; type: ItemContainerType }[];
};

export type itemsInstanceDeltaEvent =
  | {
      type: 'CREATE';
      item: ItemInstance;
      itemContainerId?: string;
    }
  | {
      type: 'UPDATE';
      itemInstanceId: string;
      itemContainerId?: string;
      updateData: Partial<ItemInstance>;
    }
  | {
      type: 'DELETE';
      itemInstanceId: string;
      itemContainerId?: string;
      itemName: string;
    };

export interface QueueCraft {
  id: string;
  recipeId: string;
  expiresAt: number;
  coreResourceId?: string;
  craftBuildingType: CraftBuildingKey;
  status: (typeof queueCraftStatusEnum.enumValues)[number];
}

export type Npc = {
  id: string;
  name: string;
};

export const buildingValues = [
  'MAGIC_SHOP',
  'TEMPLE',
  'BANK',
  'BLACKSMITH',
  'TAILOR',
  'ALCHEMY',
  'CARPENTER',
  'LOOM',
  'SAWMILL',
  'TANNERY',
  'FORGE',
] as const;
export const craftBuildingValues = ['BLACKSMITH', 'TAILOR', 'ALCHEMY', 'CARPENTER'] as const;
export const refiningBuildingValues = ['LOOM', 'SAWMILL', 'TANNERY', 'FORGE'] as const;

export type Building = {
  id: string;
  name: string;
  key: BuildingKey;
  // workingResourceCategory?: ResourceCategoryType;
  image: string;
};
export type BuildingKey = (typeof buildingValues)[number];
export type CraftBuildingKey = (typeof craftBuildingValues)[number];
export type RefiningBuildingKey = (typeof refiningBuildingValues)[number];
// export type SelectCoreResourceBuildingKey = Extract<CraftBuildingKey, 'TAILOR' | 'BLACKSMITH' | 'CARPENTRY'>;

export const tileTypeValues = [
  'OBJECT',
  'GROUND',
  'WATER',
  'DEEP_WATER',
  'CAVE',
  'STONE',
  'FOREST',
  'DARK_FOREST',
  'MEADOW',
  'PLAINS',
] as const;
export type TileType = (typeof tileTypeValues)[number];
export type OmitTileType = Exclude<TileType, 'OBJECT' | 'GROUND'>;
export type MiningTileType = Extract<TileType, 'CAVE' | 'STONE'>;
export type LumberTileType = Extract<TileType, 'FOREST' | 'DARK_FOREST'>;
export type FishingTileTpe = Extract<TileType, 'WATER' | 'DEEP_WATER'>;
export type ForagingTileTpe = Extract<TileType, 'FOREST' | 'MEADOW' | 'PLAINS'>;

export type OmitModifier = Omit<Modifier, 'id' | 'heroId'>;

export type TItemContainer = typeof itemContainerTable.$inferSelect & {
  itemsInstance: ItemInstance[];
};

export type CraftMaterial = {
  role: 'CORE' | 'OPTIONAL' | 'FIXED';

  amount: number;
  templateId?: string;
  categories?: ColoredResourceCategoryType[];
};

export type RecipeTemplate = {
  id: string;

  itemTemplateId: string;

  timeMs: number;
  requirement: {
    materials: CraftMaterial[];
    skills: { skillTemplateId: string; level: number }[];
    buildingCraftLocation: CraftBuildingKey;
  };

  defaultUnlocked: boolean;
};

export type CraftItem = RecipeTemplate;

export type EquipInfo = {
  weaponType?: WeaponType;
  weaponHand?: WeaponHandType;
  armorType?: ArmorType;
  armorCategory?: ArmorCategoryType;
};
export type ResourceInfo = {
  category: ResourceCategoryType;
};
export type BookInfo = {
  kind: 'UNLOCK' | 'TRAIN_BUFF';
  unlockSkillKey?: SkillKey;
  buffTemplateId?: string;
};
export type ToolInfo = {
  skillTemplateId: string;
};
export type PotionInfo = {
  type: 'BUFF' | 'RESTORE';
  restore?: { health?: number; mana?: number };
  buffTemplateId?: string;
};

export type ItemLocationType = (typeof itemLocationEnum.enumValues)[number];
export type ItemDurability = {
  current: number;
  max: number;
};

export type ItemInstance = typeof itemInstanceTable.$inferSelect;
export type ItemTemplate = {
  id: string;
  type: ItemTemplateType;
  name: string;
  image: string;
  key: string;
  stackable: boolean;
  description?: string;
  maxStack?: number;
  buyPrice?: number;

  equipInfo?: EquipInfo;
  resourceInfo?: ResourceInfo;
  bookInfo?: BookInfo;
  potionInfo?: PotionInfo;
  toolInfo?: ToolInfo;
  modifier?: Partial<OmitModifier>;
};

export type EffectSource = 'POTION' | 'BOOK' | 'FOOD' | 'SKILL' | 'ZONE' | 'EVENT';

export type BuffInstance = typeof buffInstanceTable.$inferSelect;
export type BuffTemplate = {
  id: string;
  name: string;
  image: string;
  type: 'POSITIVE' | 'NEGATIVE';
  source: EffectSource;
  duration: number;
  modifier: Partial<OmitModifier>;
  description?: string;
  reward?: {
    skillKey: SkillKey;
  };
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

export type EntityPayloadMap = {
  HERO: MapHero;
  CORPSE: Corpse;
  CREATURE: MapCreature;
};
export type MapChunkEntitiesType = keyof EntityPayloadMap;
export type MapChunkEntitiesData = {
  [K in keyof EntityPayloadMap]: {
    type: K;
    payload: EntityPayloadMap[K][];
  };
}[keyof EntityPayloadMap];

export type Corpse = {
  id: string;
  image: string;
  name: string;
  x: number;
  y: number;
  mapId: string;
  deadEntityId: string;
  expiredAt: number;
};

export type MapCorpse = Pick<Corpse, 'image' | 'id' | 'name' | 'x' | 'y'>;

export type CreatureType =
  | 'HUMANOID'
  | 'ANIMAL'
  | 'BEAST'
  | 'UNDEAD'
  | 'DEMON'
  | 'ELEMENTAL'
  | 'CONSTRUCT'
  | 'DRAGON'
  | 'GIANT'
  | 'SPIRIT'
  | 'PLANT'
  | 'ABERRATION';

export type CreatureTemplate = {
  id: string;
  name: string;
  key: CreatureKey;
  image: string;
  type: CreatureType;
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;

  baseModifier: Partial<OmitModifier>;
};
export type CreatureInstance = CreatureTemplate & {
  id: string;
  x: number;
  y: number;
  mapId: string;
  creatureTemplateId: string;
};
export type MapCreature = Pick<CreatureInstance, 'image' | 'id' | 'name' | 'x' | 'y'>;

export type SpawnPoint = {
  id: string;
  x: number;
  y: number;
  name: string;
  mapId: string;
  chunkId: string;
  creatureTemplateId: string;
  maxCreatures: number;
  alive: number;
  radius: number;
  respawnTime: number;
  respawnAt: number | null;
};

export type HeroSidebarItem = Pick<Hero, 'id' | 'name' | 'level' | 'state' | 'avatarImage'>;

export type MapHero = HeroSidebarItem & {
  characterImage: string;
  x: number;
  y: number;
};

export type SkillInstance = typeof skillInstanceTable.$inferSelect;
export type SkillCategory = (typeof skillCategoryValues)[number];

export type SkillTemplate = {
  id: string;
  name: string;
  category: SkillCategory;
  image: string;
  key: SkillKey;
};

export type IPosition = {
  x: number;
  y: number;
};

export const gameSysMessageObj = {
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
  success: 'SUCCESS',
  skillExp: 'SKILL_EXP',
  levelExp: 'LEVEL_EXP',
} as const;

export const gameSysMessageValues = Object.values(gameSysMessageObj);

export type GameSysMessageType = (typeof gameSysMessageValues)[number];
export interface GameSysMessage {
  text: string;
  data?: { name: string; quantity?: number }[];
  expAmount?: number;
  success?: boolean;
  type: GameSysMessageType;
  createdAt?: number;
}

export type OmitDeepHero = {
  location?: Partial<ApiGetHeroResponse['location']>;
  group?: Partial<ApiGetHeroResponse['group']>;
  regen?: Partial<ApiGetHeroResponse['regen']>;
} & Omit<Partial<ApiGetHeroResponse>, 'location' | 'group' | 'regen'>;



//API RESPONSE
export type ApiGetHeroResponse = NonNullable<InferResponseType<(typeof client.hero)['$get']>['data']>;
export type ApiGetItemContainerResponse = InferResponseType<
  (typeof client.hero)[':id']['item-container'][':itemContainerId']['$get']
>['data'];
export type ApiMapResponse = InferResponseType<(typeof client.map)[':id']['$get']>['data'];
export type ApiGeChunkMapEntities = InferResponseType<(typeof client.map)[':id']['entities']['$get']>['data'];
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
  healthAcc: number;
  manaAcc: number;
  healthTimeMs: number;
  manaTimeMs: number;
};
export type ActiveSkillTraining = {
  skillTemplateId: string;
  gainSkillExp: number;
  finishAt: number;
};
export type IHeroStatEnum = keyof IHeroStat;

export const statsSchema = createSelectSchema(modifierTable, {
  strength: z.number().int().positive(),
  constitution: z.number().int().positive(),
  intelligence: z.number().int().positive(),
  dexterity: z.number().int().positive(),
  luck: z.number().int().positive(),
  wisdom: z.number().int().positive(),
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
  freeStatPoints: z.number().int().positive(),
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
      constitution: z.number().int().positive(),
      dexterity: z.number().int().positive(),
      wisdom: z.number().int().positive(),
      luck: z.number().int().positive(),
      intelligence: z.number().int().positive(),
      strength: z.number().int().positive(),
    }),
  });
export const changeStatSchema = statsSchema.extend({
  freeStatPoints: z.number().int().positive(),
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
