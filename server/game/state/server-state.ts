import type { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import type {
  BuffInstance,
  BuffTemplate,
  Corpse,
  CreatureInstance,
  GatheringTileType,
  Hero,
  ItemInstance,
  MapHero,
  PathNode,
  QueueCraft,
  RefineOperation,
  SkillInstance,
  SpawnCreatureTileType,
  SpawnPoint,
  THeroRegen,
  TItemContainer,
} from '@/shared/types';
import type { Socket } from 'socket.io';

import type { itemInstanceTable, skillInstanceTable } from '../../db/schema';
import type { Battle } from '@/shared/battle-types';

export type HeroRuntime = Hero & {
  paths?: PathNode[];
  queueCraft: QueueCraft[];
  queueRefine: RefineOperation[];
  lastOnlineAt?: number;
  gatheringFinishAt?: number;
  refiningFinishAt?: number;
  regen: THeroRegen;
  isOnline: boolean;
  selectedGatherTile?: {
    x: number;
    y: number;
    gatherSkillUsed: GatheringCategorySkillKey;
    tileType: GatheringTileType;
  };
};

export type SpawnZonesInfo = {
  indexes: number[];
  creatureAlive: number;
  lastSpawnAt: number;
};

export type TileState = {
  charges: number;
  respawnAt: number;
  x: number;
  y: number;
};

export type ItemInstancePendingDeltaEvents =
  | {
      type: 'CREATE';
      item: typeof itemInstanceTable.$inferInsert;
    }
  | {
      type: 'UPDATE';
      itemInstanceId: string;
      updateData: Partial<typeof itemInstanceTable.$inferInsert>;
    }
  | {
      type: 'DELETE';
      itemInstanceId: string;
    };

export type SkillInstancePendingDeltaEvents = {
  type: 'UPDATE';
  skillInstanceId: string;
  updateData: Partial<typeof skillInstanceTable.$inferInsert>;
};

export const serverState = {
  hero: new Map<string, HeroRuntime>(),
  container: new Map<string, TItemContainer>(),
  skill: new Map<string, SkillInstance[]>(),
  user: new Map<string, string>(),
  socket: new Map<string, Socket>(),

  corpse: new Map<string, Corpse>(),
  creature: new Map<string, CreatureInstance>(),

  mapChunks: new Map<
    string,
    {
      heroes: Set<string>;
      corpses: Set<string>;
      creatures: Set<string>;
      spawnZones: Record<SpawnCreatureTileType, SpawnZonesInfo>;
    }
  >(),

  spawnPoints: new Map<string, SpawnPoint>(),
  chunkSpawns: new Map<string, Set<string>>(),

  worldResourceTiles: new Map<string, Map<string, TileState>>(),
  battle: new Map<string, Battle>(),
  itemInstancePendingDeltaEvents: new Set<ItemInstancePendingDeltaEvents>(),
  skillInstancePendingDeltaEvents: new Set<SkillInstancePendingDeltaEvents>(),
};
console.info('SERVER STATE INIT', new Date().toLocaleTimeString());
