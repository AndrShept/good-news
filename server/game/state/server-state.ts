import type { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import type {
  BuffInstance,
  BuffTemplate,
  CraftBuildingType,
  Hero,
  ItemInstance,
  OmitTileType,
  PathNode,
  QueueCraft,
  SkillInstance,
  TItemContainer,
} from '@/shared/types';
import type { Socket } from 'socket.io';

import type { itemInstanceTable, skillInstanceTable } from '../../db/schema';

export type HeroRuntime = Hero & {
  paths?: PathNode[];
  offlineTimer?: number;
  selectedGatherTile?: {
    x: number;
    y: number;
    gatherSkillUsed: GatheringCategorySkillKey;
    tileType: OmitTileType;
  };
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
  buff: new Map<string, BuffInstance[]>(),
  user: new Map<string, string>(),
  pathPersistQueue: new Map<string, { x: number; y: number }>(),
  queueCraft: new Map<string, QueueCraft[]>(),
  socket: new Map<string, Socket>(),
  worldResourceTiles: new Map<string, Map<string, TileState>>(),
  itemInstancePendingDeltaEvents: new Set<ItemInstancePendingDeltaEvents>(),
  skillInstancePendingDeltaEvents: new Set<SkillInstancePendingDeltaEvents>(),
};
console.log('SERVER STATE INIT', new Date().toLocaleTimeString());
