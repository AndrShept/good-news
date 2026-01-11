import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { heroService } from './hero-service';

export const itemContainerService = {
  getContainer(containerId: string) {
    const container = serverState.container.get(containerId);
    if (!container) {
      throw new HTTPException(404, { message: 'container  not found' });
    }
    return container;
  },
  getBackpack(heroId: string) {
    const hero = heroService.getHero(heroId);
    const backpackId = hero.itemContainers.find((c) => c.type === 'BACKPACK')?.id;
    if (!backpackId) {
      throw new HTTPException(404, { message: 'backpackId  not found' });
    }
    const backpack = this.getContainer(backpackId);
    return backpack;
  },
};
