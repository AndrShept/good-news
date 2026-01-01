import type { Hero, PathNode } from '@/shared/types';

type IHeroServerState = Pick<Hero, 'currentHealth' | 'currentMana' | 'maxHealth' | 'maxMana' | 'state'> & {
  x: number;
  y: number;
  paths?: PathNode[];
};

export const serverState = {
  hero: new Map<string, IHeroServerState>(),
  pathPersistQueue: [] as { heroId: string; x: number; y: number }[],
};
