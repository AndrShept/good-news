import { buffTemplateMapIds } from '@/shared/templates/buff-template';
import type { BuffInstance } from '@/shared/types';

import { serverState } from '../game/state/server-state';
import { generateRandomUuid } from '../lib/utils';
import { heroService } from './hero-service';

export const buffInstanceService = {
  createBuff(heroId: string, buffTemplateId: string) {
    const buffTemplate = buffTemplateMapIds[buffTemplateId];
    const newBuff: BuffInstance = {
      id: generateRandomUuid(),
      ownerHeroId: heroId,
      buffTemplateId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + buffTemplate.duration).toISOString(),
    };
    const buffs = serverState.buff.get(heroId) ?? [];
    if (buffs.some((b) => b.buffTemplateId === buffTemplateId)) {
      const index = buffs.findIndex((b) => b.buffTemplateId === buffTemplateId);
      if (index === -1) {
        return;
      }
      buffs.splice(index, 1);
    }
    buffs.push(newBuff);
    heroService.updateModifier(heroId);
  },
};
