import type { HeroUpdateEvent } from '@/shared/socket-data-types';
import { skillTemplateById } from '@/shared/templates/skill-template';
import type { ItemsInstanceDeltaEvent } from '@/shared/types';

import { rollChance } from '../lib/utils';
import { heroService } from '../services/hero-service';
import { itemContainerService } from '../services/item-container-service';
import { progressionService } from '../services/progression-service';
import { refiningService } from '../services/refining-service';
import { skillService } from '../services/skill-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const refineTick = (now: number) => {
  for (const [heroId, refineQueues] of serverState.queueRefine.entries()) {
    const first = refineQueues[0];
    if (!first) continue;
    const backpack = itemContainerService.getBackpack(heroId);
    const hero = heroService.getHero(heroId);
    if (first.finishAt <= now) {
      const queue = refineQueues.shift();
      if (!queue) continue;
      const itemsDelta: ItemsInstanceDeltaEvent[] = [];
      const isSuccess = rollChance(queue.refineChance);
      const refineSkillInstance = skillService.getSkillByInstanceId(heroId, queue.refineSkillInstanceId);
      const loreSkillInstance = skillService.getSkillByInstanceId(heroId, queue.loreSKillInstanceId);
      const refineSkillKey = skillTemplateById[refineSkillInstance.skillTemplateId].key;
      const loreSkillKey = skillTemplateById[loreSkillInstance.skillTemplateId].key;
      let result = {
        message: `Failed to refine ${queue.input.name} — resources lost`,
        success: false,
      };
      if (isSuccess) {
        const quantity = refiningService.getRefineOutputQuantity({
          loreSkillLevel: loreSkillInstance.level,
          refineSkillLevel: refineSkillInstance.level,
          recipe: queue.recipe,
        });
        const newItem = itemContainerService.obtainStackableItem({
          location: 'BACKPACK',
          heroId,
          itemContainerId: backpack.id,
          itemTemplateId: queue.output.itemTemplateId,
          quantity,
        });
        itemsDelta.push(...newItem);
        result.message = `Successfully refined ${queue.input.name} x${queue.input.quantity} into ${queue.output.name} x${quantity}`;
        result.success = true;
      }

      const consumeItemsDelta = itemContainerService.consumeItem({
        mode: 'use',
        itemContainerId: queue.itemContainerId,
        itemInstanceId: queue.input.itemInstanceId,
        quantity: queue.input.quantity,
      });
      itemsDelta.push(...consumeItemsDelta);
      const refineExpValue = progressionService.calculateRefineExp({
        chance: queue.refineChance,
        success: isSuccess,
        refineSkillLevel: refineSkillInstance.level,
        recipe: queue.recipe,
      });
      const loreExpValue = progressionService.calculateLoreExp({
        success: isSuccess,
        requiredMinSkill: queue.recipe.requiredMinSkill,
        loreSkillLevel: loreSkillInstance.level,
      });

      const refineExpResult = skillService.addExp(heroId, refineSkillKey, refineExpValue);
      const loreExpResult = skillService.addExp(heroId, loreSkillKey, loreExpValue);
      socketService.sendToClientSysMessage(heroId, { text: result.message, color: result.success ? 'GREEN' : 'RED' });
      socketService.sendToClientItemsDelta(heroId, itemsDelta);
      socketService.sendToClientExpResult({
        heroId,
        data: [
          { isShowMessageOnlyLvlUp: false, expResult: refineExpResult },
          { isShowMessageOnlyLvlUp: false, expResult: loreExpResult },
        ],
      });
      if (!refineQueues.length) {
        hero.state = 'IDLE';
        hero.refiningFinishAt = undefined;

        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');
        socketService.sendToClientUpdateSelfHeroData(hero.id, { refiningFinishAt: undefined });
      }
    }
  }
};
