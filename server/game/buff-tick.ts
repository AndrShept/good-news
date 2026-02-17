import type { RemoveBuffData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { buffTemplateMapIds } from '@/shared/templates/buff-template';

import { io } from '..';
import { heroService } from '../services/hero-service';
import { progressionService } from '../services/progression-service';
import { skillService } from '../services/skill-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const buffTick = (now: number) => {
  for (let [heroId, buffs] of serverState.buff.entries()) {
    for (let i = buffs.length - 1; i >= 0; i--) {
      const buff = buffs[i];
      if (buff.expiresAt <= now) {
        buffs.splice(i, 1);

        heroService.updateModifier(heroId);
        const hero = heroService.getHero(heroId);
        const buffTemplate = buffTemplateMapIds[buff.buffTemplateId];
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
        switch (buffTemplate.source) {
          case 'BOOK': {
            if (!buffTemplate.reward) continue;
            socketData.payload.hero = undefined;
            const skillInstance = skillService.getSkillByKey(heroId, buffTemplate.reward.skillKey);
            const amount = progressionService.calculateBookExp(skillInstance.level, buffTemplate.duration);
            const expResult = skillService.addExp(heroId, buffTemplate.reward.skillKey, amount);
            socketService.sendToClientExpResult({ heroId, expResult });
            break;
          }
        }
        io.to(heroId).emit(socketEvents.selfData(), socketData);
      }
    }
  }
};
