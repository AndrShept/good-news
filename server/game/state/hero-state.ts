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
import { HTTPException } from 'hono/http-exception';

type IHeroServerState = Omit<Hero, 'createdAt' | 'location'> & {
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
  equipments: ItemInstance[];
  buffs: BuffInstance[];
  itemContainers: { id: string; type: ItemContainerType; name: string }[];
  paths?: PathNode[];
  offlineTimer?: number;
};

export const serverState = {
  hero: new Map<string, IHeroServerState>(),
  pathPersistQueue: new Map<string, { x: number; y: number }>(),
  user: new Map<string, string>(),
  container: new Map<string, TItemContainer>(),

  getHeroState(heroId: string) {
    const hero = this.hero.get(heroId);
    if (!hero) {
      throw new HTTPException(404, { message: 'hero state not found' });
    }
    return hero;
  },
  getContainerState(containerId: string) {
    const container = this.container.get(containerId);

    return container;
  },
};
console.log('SERVER STATE INIT', Date.now());
console.log(serverState.user);
