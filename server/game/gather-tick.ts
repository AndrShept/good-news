import type { FinishGatheringData, HeroUpdateStateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { gatheringService } from '../services/gathering-service';
import { itemContainerService } from '../services/item-container-service';
import { itemTemplateService } from '../services/item-template-service';
import { progressionService } from '../services/progression-service';
import { skillService } from '../services/skill-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const gatherTick = (now: number) => {
  for (const [heroId, hero] of serverState.hero.entries()) {
    if (!hero.gatheringFinishAt) continue;
    if (now >= hero.gatheringFinishAt) {
      if (!hero.location.mapId || !hero.selectedGatherTile) continue;
      const gatherSkill = hero.selectedGatherTile.gatherSkillUsed;
      const tileState = gatheringService.getGatherTileState(heroId, hero.selectedGatherTile.gatherSkillUsed);

      const gatherActions = {
        MINING: 'mine',
        FISHING: 'catch',
        LUMBERJACKING: 'chop',
        FORAGING: 'gather',
        SKINNING: 'skin',
      };
      if (!tileState) continue;

      hero.state = 'IDLE';
      hero.gatheringFinishAt = null;
      if (hero.location.mapId) {
        const socketData: HeroUpdateStateData = {
          type: 'UPDATE_STATE',
          payload: { heroId: hero.id, state: hero.state },
        };
        io.to(hero.location.mapId).emit(socketEvents.mapUpdate(), socketData);
      }

      const { x, y } = tileState;
      const gatherItem = gatheringService.getGatherReward({
        gatherSkill,
        heroId,
        tileType: hero.selectedGatherTile.tileType,
        x,
        y,
      });

      const gatherSkillInstance = skillService.getSkillByKey(heroId, gatherSkill);

      if (!gatherItem) {
        const exp = progressionService.calculateGatherExp({ gatherSkillLevel: gatherSkillInstance.level });
        const expResult = skillService.addExp(heroId, gatherSkill, exp);
        socketService.sendToClientExpResult({ heroId, expResult });
        const socketData: FinishGatheringData = {
          type: 'FINISH_GATHERING',
          payload: {
            heroId,
            message: `You failed to ${gatherActions[gatherSkill]} this time.`,
          },
        };
        io.to(heroId).emit(socketEvents.selfData(), socketData);
        continue;
      }
      const itemTemplate = itemTemplateService.getAllItemsTemplate().find((i) => i.key === gatherItem.itemKey);
      if (!itemTemplate) {
        throw new HTTPException(404, { message: 'itemTemplate not found' });
      }

      const luck = hero.stat.luck;
      const loreSkillKey = skillService.getLoreSkillByItemTemplateId(itemTemplate.id);
      const lorSkillInstance = loreSkillKey ? skillService.getSkillByKey(heroId, loreSkillKey) : undefined;
      const backpack = itemContainerService.getBackpack(heroId);

      const quantity = gatheringService.getGatherRewardQuantity({
        luck,
        gatherSkillLevel: gatherSkillInstance.level,
        loreSkillLevel: lorSkillInstance?.level,
        maxQuantity: gatherItem.maxGatherQuantity,
      });

      tileState.charges -= quantity;

      itemContainerService.createItem({
        heroId,
        coreResourceId: undefined,
        itemContainerId: backpack.id,
        itemTemplateId: itemTemplate.id,
        quantity,
      });
      const exp = progressionService.calculateGatherExp({
        gatherSkillLevel: gatherSkillInstance.level,
        requiredMinSkill: gatherItem.requiredMinSkill,
      });

      const expResult = skillService.addExp(heroId, gatherSkill, exp);
      socketService.sendToClientExpResult({ heroId, expResult });

      const socketData: FinishGatheringData = {
        type: 'FINISH_GATHERING',
        payload: {
          heroId,
          backpack,
          itemName: itemTemplate.name,
          quantity,
          message: `You successfully ${gatherActions[gatherSkill]} the `,
        },
      };
      io.to(heroId).emit(socketEvents.selfData(), socketData);
    }
  }
};
