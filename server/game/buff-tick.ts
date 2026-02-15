import type { RemoveBuffData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { heroService } from '../services/hero-service';
import { serverState } from './state/server-state';

export const buffTick = (now: number) => {
  for (let [heroId, buffs] of serverState.buff.entries()) {
    for (let i = buffs.length - 1; i >= 0; i--) {
      const buff = buffs[i];
      if (buff.expiresAt <= now) {
        buffs.splice(i, 1);
        heroService.updateModifier(heroId);
        const hero = heroService.getHero(heroId);
        
        const socketData: RemoveBuffData = {
          type: 'REMOVE_BUFF',
          payload: {
            buffInstanceId: buff.id,
            hero: {
              currentHealth: hero.currentHealth,
              currentMana: hero.currentMana,
              maxHealth: hero.maxHealth,
              maxMana: hero.maxMana,
              modifier: hero.modifier,
            },
          },
        };
        io.to(heroId).emit(socketEvents.selfData(), socketData);
      }
    }
  }
};
