import type {
  BuffInstance,
  BuffTemplate,
  Hero,
  IHeroStat,
  ItemContainerType,
  ItemInstance,
  OmitModifier,
  PathNode,
  SkillInstance,
  TItemContainer,
} from '@/shared/types';

export type HeroRuntime = Hero & {
  paths?: PathNode[];
  offlineTimer?: number;
};

export const serverState = {
  hero: new Map<string, HeroRuntime>(),
  container: new Map<string, TItemContainer>(),
  skill: new Map<string, SkillInstance[]>(),
  buff: new Map<string, BuffInstance[]>(),
  user: new Map<string, string>(),
  pathPersistQueue: new Map<string, { x: number; y: number }>(),
};
console.log('SERVER STATE INIT', new Date().toLocaleTimeString());
