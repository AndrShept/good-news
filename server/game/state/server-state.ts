import type {
  BuffInstance,
  Hero,
  IHeroStat,
  ItemContainerType,
  ItemInstance,
  OmitModifier,
  PathNode,
  TItemContainer,
} from '@/shared/types';

export type IHeroServerState = Hero & {
  paths?: PathNode[];
  offlineTimer?: number;
};

export const serverState = {
  hero: new Map<string, IHeroServerState>(),
  container: new Map<string, TItemContainer>(),
  user: new Map<string, string>(),
  pathPersistQueue: new Map<string, { x: number; y: number }>(),
};
console.log('SERVER STATE INIT', new Date().toLocaleTimeString());
