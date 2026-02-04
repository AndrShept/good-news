import type { SkillUpData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';

import { io } from '..';
import { skillService } from '../services/skill-service';
import { serverState } from './state/server-state';

export const regenTick = (now: number, TICK_RATE: number) => {
  for (const [heroId, hero] of serverState.hero.entries()) {
    let lastUpdate = now - TICK_RATE;
    const delta = now - lastUpdate;
    if (delta <= 0 || hero.state === 'BATTLE') continue;
    console.log('healthTimeMs', hero.regen.healthTimeMs);
    console.log('manaTimeMs', hero.regen.manaTimeMs);
    if (hero.currentHealth < hero.maxHealth) {
      hero.regen.healthAcc += delta / hero.regen.healthTimeMs;

      const gain = Math.floor(hero.regen.healthAcc);
      if (gain > 0) {
        hero.currentHealth = Math.min(hero.currentHealth + gain, hero.maxHealth);
        hero.regen.healthAcc -= gain;
        const result = skillService.setSkillExp(heroId, 'REGENERATION', gain);

        if (result.isLevelUp) {
          const socketData: SkillUpData = {
            type: 'SKILL_UP',
            payload: { skillInstanceId: result.skillInstanceId, message: result.message },
          };
          io.to(heroId).emit(socketEvents.selfData(), socketData);
        }
      }
    }

    if (hero.currentMana < hero.maxMana) {
      hero.regen.manaAcc += delta / hero.regen.manaTimeMs;

      const gain = Math.floor(hero.regen.manaAcc);
      if (gain > 0) {
        hero.currentMana = Math.min(hero.currentMana + gain, hero.maxMana);
        skillService.setSkillExp(heroId, 'MEDITATION', gain);
        hero.regen.manaAcc -= gain;

        const result = skillService.setSkillExp(heroId, 'MEDITATION', gain);

        if (result.isLevelUp) {
          const socketData: SkillUpData = {
            type: 'SKILL_UP',
            payload: { skillInstanceId: result.skillInstanceId, message: result.message },
          };
          io.to(heroId).emit(socketEvents.selfData(), socketData);
        }
      }
    }

    lastUpdate = now;
    console.log('HP', hero.currentHealth);
    console.log('HP ACC', hero.regen.healthAcc);
    console.log('MANA', hero.currentMana);
    console.log('MANA ACC', hero.regen.manaAcc);
    console.log('delta', delta);
  }
};
