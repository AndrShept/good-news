import type { Hero, IHeroStat, OmitModifier, PathNode } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

type IHeroServerState = Pick<
  Hero,
  | 'currentHealth'
  | 'currentMana'
  | 'maxHealth'
  | 'maxMana'
  | 'state'
  | 'isOnline'
  | 'userId'
  | 'avatarImage'
  | 'characterImage'
  | 'id'
  | 'name'
  | 'level'
  | 'maxQueueCraftCount'
  | 'goldCoins'
  | 'premiumCoins'
> & {
  location: {
    x: number;
    y: number;
    targetX: number | null;
    targetY: number | null;
    mapId: string | null;
    placeId: string | null;
  };
  stat: IHeroStat;
  modifier: OmitModifier;
  paths?: PathNode[];
  offlineTimer?: number;
};

export const serverState = {
  hero: new Map<string, IHeroServerState>(),
  pathPersistQueue: new Map<string, { x: number; y: number }>(),

  getHeroState(heroId: string) {
    const hero = this.hero.get(heroId);
    if (!hero) {
      throw new HTTPException(404, { message: 'hero state not found' });
    }
    return hero;
  },
};
