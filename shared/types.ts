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
  fishTypeEnum,
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
import type { queueCraftStatusEnum } from '../server/db/schema/queue-craft-item-schema';
import type { skillInstanceTable } from '../server/db/schema/skill-instance-schema';
import type { Layer, Tileset } from './json-types';
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
export type FishType = (typeof fishTypeEnum.enumValues)[number];
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

// export const modifierValues =  Object.keys(modifierObj)

export type Modifier = {
  strength: number;
  dexterity: number;
  intelligence: number;
  wisdom: number;
  constitution: number;
  luck: number;

  bonusMaxHealth: number;
  bonusMaxMana: number;

  manaRegen: number;
  healthRegen: number;

  armor: number;
  magicResistance: number;
  evasion: number;

  spellDamage: number;
  spellCritDamage: number;
  spellCritRating: number;
  spellHitRating: number;
  spellPenetration: number;

  physDamage: number;
  physCritDamage: number;
  physCritRating: number;
  physHitRating: number;
  physPenetration: number;
};

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

export type GameMap = {
  id: string;
  width: number;
  height: number;
  tileHeight: number;
  tileWidth: number;
  offsetX: number;
  offsetY: number;
  name: string;
  tileset: Tileset[];
  layers: Layer[];
  places: TPlace[];
  entrances: Entrance[];
};
export type PlaceType = 'TOWN' | 'MINE' | 'DUNGEON';

export type TPlace = {
  id: string;
  name: string;
  image: string;
  x: number;
  y: number;
  mapId: string;
  buildingIds: string[];
  type: PlaceType;
  npcIds: string[];
  entrances: Entrance[];
  itemContainers: { id: string; name: string; color: string | null; type: ItemContainerType }[];
};

export type ItemsInstanceDeltaEvent =
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

export const npcTypeValues = ['ALCHEMIST', 'BLACKSMITH', 'TINKER', 'INSCRIBER', 'COOK', 'GM_TRADER'] as const;
export const npcTabValues = ['BUY', 'SELL', 'QUEST'] as const;
export type NPCTabType = (typeof npcTabValues)[number];
export type NPCType = (typeof npcTypeValues)[number];

export type NPC = {
  id: string;
  image: string;
  name: string;
  type: NPCType;
  greetings: string[];
};

export type NPCShopTable = {
  sells: NPCSellItem[];
  buys: NPCBuyItem[];
};
export type NPCSellItem = {
  itemTemplateId: string;
  price: number;
  stock?: number;
};

export type NPCBuyItem = {
  itemTemplateId: string;
  price: number; // скільки він платить гравцю
};

// 3. Окремо — які квести він дає
export type NPCQuestTable = {
  npcId: string;
  questIds: string[];
};
export type ShopCartItem = { id: string; quantity: number; itemInstanceId?: string | undefined };

export const buildingValues = [
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

export const gatheringTileTypeValues = [
  'ROCKY_FIELD',
  'CAVE',
  'MOUNTAIN',
  'FOREST',
  'DENSE_FOREST',
  'ANCIENT_FOREST',
  'RIVER',
  'LAKE',
  'SEA',
  'MEADOW',
  'PLAINS',
  'SWAMP',
] as const;
export const spawnCreatureTileTypeValues = [
  'ROCKY_FIELD',
  'CAVE',
  'MOUNTAIN',
  'FOREST',
  'DENSE_FOREST',
  'ANCIENT_FOREST',
  'LAKE',
  'RIVER',
  'MEADOW',
  'PLAINS',
  'SWAMP',
  'FARM',
] as const;
export const terrainTileTypeValues = ['GROUND', 'OBJECT', 'DECOR', 'ABOVE_PLAYER', 'COLLISION'] as const;

export const tileTypeValues = [...new Set([...terrainTileTypeValues, ...gatheringTileTypeValues, ...spawnCreatureTileTypeValues])] as const;
export type TerrainTileType = (typeof terrainTileTypeValues)[number];
export type GatheringTileType = (typeof gatheringTileTypeValues)[number];
export type SpawnCreatureTileType = (typeof spawnCreatureTileTypeValues)[number];
export type TileType = (typeof tileTypeValues)[number];

export type MiningTileType = Extract<GatheringTileType, 'ROCKY_FIELD' | 'CAVE' | 'MOUNTAIN'>;
export type LumberTileType = Extract<GatheringTileType, 'FOREST' | 'DENSE_FOREST' | 'ANCIENT_FOREST'>;
export type FishingTileType = Extract<GatheringTileType, 'RIVER' | 'LAKE' | 'SEA'>;
export type ForagingTileType = Extract<GatheringTileType, 'MEADOW' | 'PLAINS' | 'SWAMP' | 'FOREST' | 'DENSE_FOREST'>;

export type TItemContainer = typeof itemContainerTable.$inferSelect & {
  itemsInstance: ItemInstance[];
};

export type RefiningRecipe = {
  input: string;
  inputQuantity: number;
  output: CoreResourceType;
  outputQuantity: number;
  requiredMinSkill: number;
  refiningTimeMs: number;
};

export type RefineOperation = {
  input: { itemInstanceId: string; itemTemplateId: string; quantity: number; name: string };
  output: { itemTemplateId: string; quantity: number; name: string };
  finishAt: number;
  refineChance: number;
  refineSkillInstanceId: string;
  loreSKillInstanceId: string;
  itemContainerId: string;
  recipe: RefiningRecipe;
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
  minDamage?: number;
  maxDamage?: number;
  equipInfo?: EquipInfo;
  resourceInfo?: ResourceInfo;
  bookInfo?: BookInfo;
  potionInfo?: PotionInfo;
  toolInfo?: ToolInfo;
  modifier?: Partial<Modifier>;
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
  modifier: Partial<Modifier>;
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
  | 'ANIMAL' // farm, meadow — корова, кролик, олень
  | 'BEAST' // ліс, гори — вовк, ведмідь, кабан
  | 'REPTILE' // rocky field, swamp — ящірка, змія, скорпіон
  | 'INSECT' // meadow, forest — метелик, павук, жук
  | 'HUMANOID' // plains, rocky — гоблін, бандит
  | 'GIANT' // mountain, cave — troll, golem
  | 'UNDEAD' // swamp, cave — skeleton, zombie
  | 'ELEMENTAL' // mountain, cave — stone/fire elemental
  | 'SPIRIT' // ancient forest, swamp — лісовий дух
  | 'PLANT'; // ancient forest — treant

export type CreatureTemplate = {
  id: string;
  name: string;
  key: CreatureKey;
  image: string;
  scale: number;
  type: CreatureType;
  isAggressive: boolean;
  currentHealth: number;
  maxHealth: number;
  currentMana: number;
  maxMana: number;
  equipments: ItemInstance[];
  modifier: Modifier;
};
export type CreatureInstance = CreatureTemplate & {
  id: string;
  x: number;
  y: number;
  mapId: string;
  state: Extract<StateType, 'IDLE' | 'BATTLE' | 'WALK'>;
  creatureTemplateId: string;
};
export type MapCreature = Pick<CreatureInstance, 'image' | 'scale' | 'id' | 'name' | 'state' | 'x' | 'y'>;

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
  foreground: 'FOREGROUND',
  grey: 'GREY',
  yellow: 'YELLOW',
  red: 'RED',
  green: 'GREEN',
  purple: 'PURPLE',
  blue: 'BLUE',
} as const;

export const gameSysMessageValues = Object.values(gameSysMessageObj);

export type GameSysMessageType = (typeof gameSysMessageValues)[number];

export interface GameSysMessage {
  text: string;
  data?: { name: string; quantity?: number }[];
  color: GameSysMessageType;
  createdAt?: number;
}

export interface HitResult {
  LEFT_HAND: { hit: BattleZoneType | null; handResult: HandResult | null; giveDamage: number; isCriticalDamage: boolean };
  RIGHT_HAND: { hit: BattleZoneType | null; handResult: HandResult | null; giveDamage: number; isCriticalDamage: boolean };
}

export type OmitDeepHero = {
  location?: Partial<ApiGetHeroResponse['location']>;
  group?: Partial<ApiGetHeroResponse['group']>;
  regen?: Partial<ApiGetHeroResponse['regen']>;
} & Omit<Partial<ApiGetHeroResponse>, 'location' | 'group' | 'regen'>;

//BATTLE

export const battleZoneValues = ['HEAD', 'CHEST', 'HANDS', 'FEET'] as const;
export const battleShieldZoneValues = [
  ['HEAD', 'CHEST'],
  ['CHEST', 'HANDS'],
  ['HANDS', 'FEET'],
  ['FEET', 'HEAD'],
] as const;

export type SelectedAttackingZone = z.infer<typeof selectedAttackingZoneSchema>;
export type SelectedDefenseZone = z.infer<typeof selectedDefenseZoneSchema>;

export type BattleSide = 'ATTACKER' | 'DEFENDER';
export type BattleParticipantType = 'HERO' | 'CREATURE';
export type BattleStatusType = 'IN_PROGRESS' | 'FINISHED';
export type DamageType = 'MAGIC' | 'PHYSICAL';

export type BattleZoneType = (typeof battleZoneValues)[number];
export type BattleShieldZoneType = (typeof battleShieldZoneValues)[number];

// Тип дії
export type BattleActionType = 'INSTANT' | 'NORMAL';
export type HandResult = 'HIT' | 'BLOCKED' | 'MISSED' | null;

// Категорія дії
export type BattleActionCategory =
  | 'PHYSICAL_ATTACK' // удар зброєю по зонах
  | 'ABILITY' // магія + фізичні абіліті + бафи на себе
  | 'ITEM' // використати предмет
  | 'FLEE';

export type BattleLocation = {
  mapId: string;
  x: number;
  y: number;
};
export type Battle = {
  id: string;
  status: BattleStatusType;
  currentRound: number;
  roundEndsAt: number;
  location: BattleLocation;
  pendingActions: BattleAction[];
  logs: BattleLog[];
  participants: BattleParticipant[];
};
export type BattleDto = {
  id: string;
  status: BattleStatusType;
  currentRound: number;
  roundEndsAt: number;
  pendingActions: BattleAction[];
  logs: BattleLog[];
  participants: BattleParticipantDto[];
};

export type BattleLog = PhysicalAttackLog | AbilityLog;

export type PhysicalAttackLog = {
  id: string;
  type: 'PHYSICAL_ATTACK';
  attackerId: string;
  attackerName: string;
  defenderId: string;
  defenderName: string;
  defendZone: SelectedDefenseZone;
  giveDamage: number;
  defenderCurrentHealth: number;
  defenderMaxHealth: number;
  attackingZone: BattleZoneType | null;
  hand: keyof HitResult;
  isMissed: boolean;
  isCriticalDamage: boolean;
  isBlocking: boolean;
  createdAt: number;
};
export type AbilityLog = {
  id: string;
  type: 'ABILITY';
  casterId: string;
  casterName: string;
  targetId: string;
  targetName: string;
  abilityId: string;
  abilityName: string;
  isMissed: boolean;
  isCriticalDamage: boolean;
  giveDamage?: number;
  healAmount?: number;
  createdAt: number;
};

export type BattleAction = {
  id: string;
  participantId: string;
  category: BattleActionCategory;
  actionType: BattleActionType;
  targetId: string;
  attackingZone: SelectedAttackingZone;
  defenseZone: SelectedDefenseZone;
  abilityId?: string;
};
export type BattleParticipantDto = Omit<BattleParticipant, 'modifier'> & { modifier: Partial<Modifier> };
export type BattleParticipant = Pick<
  Hero,
  | 'id'
  | 'name'
  | 'currentHealth'
  | 'maxHealth'
  | 'currentMana'
  | 'maxMana'
  | 'level'
  | 'avatarImage'
  | 'characterImage'
  | 'equipments'
  | 'buffs'
> & {
  scale?: number;
  stat?: IHeroStat;
  modifier: Modifier;
  type: BattleParticipantType;
  side: BattleSide;
  isDead: boolean;
  targetId: string | null;
};

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

export type IHeroStat = Pick<Modifier, 'strength' | 'dexterity' | 'intelligence' | 'wisdom' | 'constitution' | 'luck'>;
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

export const statsSchema = z.object({
  strength: z.number().int().positive(),
  constitution: z.number().int().positive(),
  intelligence: z.number().int().positive(),
  dexterity: z.number().int().positive(),
  luck: z.number().int().positive(),
  wisdom: z.number().int().positive(),
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
  items: z.array(
    z.object({
      id: z.string().uuid(),
      quantity: z.number().int().positive(),
      itemInstanceId: z.string().uuid().optional(),
    }),
  ),
  // .refine((items) => new Set(items.map((i) => i.id)).size === items.length, { message: 'Duplicate item id' }),
});

const battleZoneSchema = z.enum(battleZoneValues);

const battleShieldZoneSchema = z.union([
  z.tuple([z.literal('HEAD'), z.literal('CHEST')]),
  z.tuple([z.literal('CHEST'), z.literal('HANDS')]),
  z.tuple([z.literal('HANDS'), z.literal('FEET')]),
  z.tuple([z.literal('FEET'), z.literal('HEAD')]),
]);

const selectedAttackingZoneSchema = z.object({
  LEFT_HAND: battleZoneSchema.nullable(),
  RIGHT_HAND: battleZoneSchema.nullable(),
});

const selectedDefenseZoneSchema = z.union([battleZoneSchema, battleShieldZoneSchema]);

export const endTurnSchema = z.object({
  attackingZone: selectedAttackingZoneSchema,
  defenseZone: selectedDefenseZoneSchema,
  targetId: z.string().uuid(),
});
