import type { FinishGatheringEvent, HeroUpdateEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import type { ItemsInstanceDeltaEvent } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { equipmentService } from '../services/equipment-service';
import { gatheringService } from '../services/gathering-service';
import { itemContainerService } from '../services/item-container-service';
import { itemInstanceService } from '../services/item-instance-service';
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
        WOODCUTTING: 'chop',
        FORAGING: 'gather',
        SKINNING: 'skin',
      };
      if (!tileState) continue;

      hero.state = 'IDLE';
      hero.gatheringFinishAt = undefined;

      const { x, y } = tileState;
      const gatherResult = gatheringService.getGatherTableItem({
        gatherSkill,
        heroId,
        tileType: hero.selectedGatherTile.tileType,
        x,
        y,
      });
      if (!gatherResult) continue;

      const gatherSkillInstance = skillService.getSkillByKey(heroId, gatherSkill);

      const itemTemplate = itemTemplateService.getAllItemsTemplate().find((i) => i.key === gatherResult.gatherItem?.itemKey);
      if (!itemTemplate) {
        throw new HTTPException(404, { message: 'itemTemplate not found' });
      }

      const luck = hero.stat.luck;
      const loreSkillKey = skillService.getLoreSkillByItemTemplateId(itemTemplate.id);
      const lorSkillInstance = skillService.getSkillByKey(heroId, loreSkillKey);
      const backpack = itemContainerService.getBackpack(heroId);

      const quantity = gatheringService.getGatherRewardQuantity({
        luck,
        gatherSkillLevel: gatherSkillInstance.level,
        loreSkillLevel: lorSkillInstance.level,
        maxQuantity: gatherResult.gatherItem.maxGatherQuantity,
      });
      let inventoryDeltas: ItemsInstanceDeltaEvent[] = [];
      if (gatherResult.success) {
        tileState.charges -= quantity;
        inventoryDeltas = itemContainerService.createItem({
          heroId,
          coreResourceId: undefined,
          itemContainerId: backpack.id,
          itemTemplateId: itemTemplate.id,
          quantity,
          isAddPendingEvents: true,
        });
      }
      const exp = progressionService.calculateGatherExp({
        gatherSkillLevel: gatherSkillInstance.level,
        requiredMinSkill: gatherResult.gatherItem.requiredMinSkill,
        success: gatherResult.success,
      });
      const expLore = progressionService.calculateLoreExp({
        loreSkillLevel: lorSkillInstance.level,
        requiredMinSkill: gatherResult.gatherItem.requiredMinSkill,
        success: gatherResult.success,
      });

      const expGatherResult = skillService.addExp(heroId, gatherSkill, exp);
      const expLoreResult = skillService.addExp(heroId, loreSkillKey, expLore);
      socketService.sendToClientExpResult({
        heroId,
        data: [
          { isShowMessageOnlyLvlUp: false, expResult: expGatherResult },
          { isShowMessageOnlyLvlUp: false, expResult: expLoreResult },
        ],
      });

      const equippedTool = equipmentService.findEquipTool(heroId, gatherSkill);

      const equipmentDeltas = equippedTool?.toolInstance
        ? itemInstanceService.decrementDurability(heroId, equippedTool.toolInstance.id, 1)
        : undefined;

      const socketData: FinishGatheringEvent = {
        type: 'FINISH_GATHERING',
        payload: {
          itemName: gatherResult.success ? itemTemplate.name : undefined,
          quantity: gatherResult.success ? quantity : undefined,
          message: gatherResult.success
            ? `You successfully ${gatherActions[gatherSkill]} the `
            : `You failed to ${gatherActions[gatherSkill]} this time.`,
          equipmentDeltas: equipmentDeltas ? [equipmentDeltas] : [],
          inventoryDeltas,
        },
      };
      io.to(heroId).emit(socketEvents.selfData(), socketData);

      if (hero.location.chunkId) {
        socketService.sendMapUpdateEntity(heroId, hero.location.chunkId, {
          type: 'HERO',
          payload: {
            state: 'IDLE',
          },
        });
      }
    }
  }
};
