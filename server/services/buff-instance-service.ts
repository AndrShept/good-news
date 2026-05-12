import type { BuffUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { buffTemplateMapIds } from '@/shared/templates/buff-template';
import type { BuffInstance } from '@/shared/types';

import { io } from '..';
import { generateRandomUuid } from '../lib/utils';
import { heroService } from './hero-service';

export const buffInstanceService = {
  createBuff(heroId: string, buffTemplateId: string) {
    const buffTemplate = buffTemplateMapIds[buffTemplateId];
    const hero = heroService.getHero(heroId);
    const newBuff: BuffInstance = {
      id: generateRandomUuid(),
      ownerHeroId: heroId,
      buffTemplateId,
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + buffTemplate.duration,
    };
    if (hero.buffs.some((b) => b.buffTemplateId === buffTemplateId)) {
      // const index = buffs.findIndex((b) => b.buffTemplateId === buffTemplateId);
      // if (index === -1) {
      //   return;
      // }
      // buffs.splice(index, 1);
      const findBuff = hero.buffs.find((b) => b.buffTemplateId === buffTemplateId);
      if (findBuff) {
        findBuff.expiresAt = Date.now() + buffTemplate.duration;

        // const socketData: BuffUpdateData = {
        //   buffInstanceId: findBuff.id,
        //   updateData: { expiresAt: findBuff.expiresAt },
        // };
        // io.to(heroId).emit(socketEvents.buffUpdate(), socketData);
      }
      return findBuff;
    }
    hero.buffs.push(newBuff);
    heroService.updateModifier(heroId);
    return newBuff;
  },
};
