import type {
  FinishGatheringEvent,
  HeroUpdateEvent,
  LoadMapChunkEntityEvent,
  QueueCraftItemSocketEvent,
  RemoveMapChunkEntityEvent,
} from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { skillTemplateById } from '@/shared/templates/skill-template';
import type { ItemsInstanceDeltaEvent, PathNode } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { io } from '..';
import { type HeroRuntime, serverState } from '../game/state/server-state';
import { heroOffline } from '../lib/heroOffline';
import { getDisplayName, rollChance } from '../lib/utils';
import { mapService } from '../services/map-service';
import { socketService } from '../services/socket-service';
import { equipmentService } from './equipment-service';
import { gatheringService } from './gathering-service';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { itemInstanceService } from './item-instance-service';
import { itemTemplateService } from './item-template-service';
import { progressionService } from './progression-service';
import { queueCraftService } from './queue-craft-service';
import { refiningService } from './refining-service';
import { skillService } from './skill-service';

export const heroTickService = {
  heroTick(now: number, TICK_RATE: number) {
    for (const heroId of serverState.hero.keys()) {
      this.moveTick(heroId, now);
      this.gatherTick(heroId, now);
      this.refineTick(heroId, now);
      this.queueCraftTick(heroId, now);
      this.heroOffline(heroId, now);
      //   this.regenTick(heroId, now, TICK_RATE);
    }
  },
  moveTick(heroId: string, now: number) {
    const hero = heroService.getHero(heroId);
    if (!hero.paths?.length) return;
    const nextPath = hero.paths[0];
    let lastStep: PathNode | null = null;
    if (nextPath.completedAt <= now) {
      const step = hero.paths.shift();
      if (!step) return;
      if (!hero.location.mapId) return;
      lastStep = step;

      const chunkId = mapService.getChunkId({ mapId: hero.location.mapId, x: step.x, y: step.y });

      if (chunkId !== hero.location.chunkId) {
        const socket = socketService.getSocket(heroId);
        hero.location.chunkId = chunkId;
        const oldChunks = mapService.getAroundChunkIds({ x: hero.location.x, y: hero.location.y, mapId: hero.location.mapId });
        const newChunks = mapService.getAroundChunkIds({ x: step.x, y: step.y, mapId: hero.location.mapId });
        const diffOld = oldChunks.filter((c) => !newChunks.includes(c));
        const diffNew = newChunks.filter((c) => !oldChunks.includes(c));
        // console.log('oldChunks', oldChunks);
        // console.log('newChunks', newChunks);
        // console.log('diffOld', diffOld);
        // console.log('diffNew', diffNew);
        mapService.despawnMapEntitiesInChunk({
          entityId: heroId,
          mapId: hero.location.mapId,
          type: 'HERO',
          x: hero.location.x,
          y: hero.location.y,
        });
        for (const old of diffOld) {
          socket.leave(old);
        }
        for (const dNew of diffNew) {
          socket.join(dNew);
        }

        mapService.spawnMapEntitiesInChunk({ entityId: heroId, type: 'HERO', x: step.x, y: step.y, mapId: hero.location.mapId });
        socketService.sendMapChunkSpawnEntities({ chunkId, entityIds: [heroId], type: 'HERO' });

        const newEntity = mapService.getMapEntitiesByChunkIds(diffNew);
        const oldEntity = mapService.getMapEntitiesByChunkIds(diffOld);
        // console.log(newEntity);
        const socketLoadData: LoadMapChunkEntityEvent = {
          type: 'LOAD_MORE_ENTITY',
          payload: newEntity,
        };
        const socketRemoveData: RemoveMapChunkEntityEvent = {
          type: 'REMOVE_OLD_ENTITY',
          payload: {
            ...oldEntity,
            corpses: oldEntity.corpses.map((c) => c.id),
            creatures: oldEntity.creatures.map((c) => c.id),
            heroes: oldEntity.heroes.map((h) => h.id),
          },
        };
        const updateHero: HeroUpdateEvent = {
          type: 'UPDATE_HERO',
          heroId,
          payload: { location: { chunkId } },
        };
        io.to(heroId).emit(socketEvents.selfData(), socketRemoveData);
        io.to(heroId).emit(socketEvents.selfData(), socketLoadData);
        io.to(heroId).emit(socketEvents.selfData(), updateHero);
      }
      hero.location.x = step.x;
      hero.location.y = step.y;
      socketService.sendMapMoveHero(heroId, chunkId);
    }

    if (!hero.paths.length && lastStep) {
      hero.location.targetX = null;
      hero.location.targetY = null;
      hero.state = 'IDLE';

      socketService.sendMapChunkMoveFinish(heroId, hero.location.chunkId!);
    }
  },
  gatherTick(heroId: string, now: number) {
    const hero = heroService.getHero(heroId);
    if (!hero.gatheringFinishAt) return;
    if (now >= hero.gatheringFinishAt) {
      if (!hero.location.mapId || !hero.selectedGatherTile) return;
      const gatherSkill = hero.selectedGatherTile.gatherSkillUsed;
      const tileState = gatheringService.getGatherTileState(heroId, hero.selectedGatherTile.gatherSkillUsed);

      const gatherActions = {
        MINING: 'mine',
        FISHING: 'catch',
        WOODCUTTING: 'chop',
        FORAGING: 'gather',
        SKINNING: 'skin',
      };
      if (!tileState) return;

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
      if (!gatherResult) return;

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
  },
  refineTick(heroId: string, now: number) {
    const hero = heroService.getHero(heroId);
    const first = hero.queueRefine[0];
    if (!first) return;
    const backpack = itemContainerService.getBackpack(heroId);
    if (first.finishAt <= now) {
      const queue = hero.queueRefine.shift();
      if (!queue) return;
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
      if (!hero.queueRefine.length) {
        hero.state = 'IDLE';
        hero.refiningFinishAt = undefined;

        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');
        socketService.sendToClientUpdateSelfHeroData(hero.id, { refiningFinishAt: undefined });
      }
    }
  },
  queueCraftTick(heroId: string, now: number) {
    const hero = heroService.getHero(heroId);
    const first = hero.queueCraft.at(0);
    if (!first) return;
    if (first.expiresAt <= now) {
      const queue = hero.queueCraft.shift();
      if (!queue) return;
      const backpack = itemContainerService.getBackpack(heroId);
      const recipe = recipeTemplateById[queue.recipeId];
      const next = hero.queueCraft.at(0);
      const template = itemTemplateService.getAllItemsTemplateMapIds()[recipe.itemTemplateId];
      const result = { message: '', success: true };
      try {
        queueCraftService.canStartCraft(heroId, queue.coreResourceId, queue.recipeId);
      } catch (err) {
        const error = err as Error;
        result.message = error.message;
        result.success = false;
      }

      if (!result.success) {
        const socketData: QueueCraftItemSocketEvent = {
          type: 'FAILED',
          payload: {
            message: result.message,
            queueItemCraftId: queue.id,
          },
        };
        io.to(heroId).emit(socketEvents.queueCraft(), socketData);
        if (next) {
          queueCraftService.setNextQueue(heroId, next.id, recipeTemplateById[next.recipeId].timeMs);
        }
        if (!hero.queueCraft.length) {
          socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');
          hero.state = 'IDLE';
        }
        return;
      }

      const skillInstance = skillService.getSkillBySkillTemplateId(heroId, recipe.requirement.skills[0].skillTemplateId);
      const skillKey = skillTemplateById[skillInstance.skillTemplateId].key;

      const firstFixedMaterial = recipe.requirement.materials.find((m) => m.role === 'FIXED');
      const loreSkillKey = skillService.getLoreSkillByItemTemplateId(queue.coreResourceId ?? firstFixedMaterial?.templateId!);
      const loreSkillInstance = skillService.getSkillByKey(heroId, loreSkillKey);
      const chance = queueCraftService.getCraftChance({
        coreResourceId: queue.coreResourceId,
        recipeMin: recipe.requirement.skills[0].level,
        craftSkillLevel: skillInstance.level,
        loreSkillLevel: loreSkillInstance.level,
      });
      const successCraft = rollChance(chance);
      const finalExp = progressionService.calculateCraftExp({
        chance,
        recipe,
        success: successCraft,
        coreResourceId: queue.coreResourceId,
      });
      const finalExpLoreSkill = progressionService.calculateLoreExp({
        loreSkillLevel: loreSkillInstance.level,
        requiredMinSkill: recipe.requirement.skills[0].level,
        success: successCraft,
      });
      const expResult = skillService.addExp(heroId, skillKey, finalExp);
      const expResultLoreSkill = skillService.addExp(heroId, loreSkillKey, finalExpLoreSkill);

      const displayName = getDisplayName(recipe.itemTemplateId, queue.coreResourceId);
      const itemsDelta: ItemsInstanceDeltaEvent[] = [];
      if (successCraft) {
        const newItemDelta = itemContainerService.createItem({
          itemContainerId: backpack.id,
          heroId,
          quantity: 1,
          itemTemplateId: template.id,
          coreResourceId: queue.coreResourceId,
          isAddPendingEvents: true,
        });
        itemsDelta.push(...newItemDelta);
        result.message = 'Success complete craft item';
      } else {
        result.message = 'Crafting failed! The materials were lost in the process';
      }

      const consumeItemsDelta = queueCraftService.consumeAllItemsForCraft(queue.coreResourceId, backpack, recipe);
      itemsDelta.push(...consumeItemsDelta);

      const socketData: QueueCraftItemSocketEvent = {
        type: 'COMPLETE',
        payload: {
          message: result.message,
          itemName: displayName ?? template.name,
          successCraft,
          queueItemCraftId: queue.id,
          itemsDelta,
        },
      };

      socketService.sendToClientExpResult({
        heroId,
        data: [
          { isShowMessageOnlyLvlUp: false, expResult },
          { isShowMessageOnlyLvlUp: false, expResult: expResultLoreSkill },
        ],
      });
      io.to(heroId).emit(socketEvents.queueCraft(), socketData);
      if (next) {
        queueCraftService.setNextQueue(heroId, next.id, recipeTemplateById[next.recipeId].timeMs);
      }
      if (!hero.queueCraft.length) {
        socketService.sendToPlaceUpdateState(hero.id, hero.location.placeId, 'IDLE');

        hero.state = 'IDLE';
      }
    }
  },
  regenTick(heroId: string, now: number, TICK_RATE: number) {
    const hero = heroService.getHero(heroId);
    let lastUpdate = now - TICK_RATE;
    const delta = now - lastUpdate;
    if (delta <= 0 || hero.state === 'BATTLE') return;
    console.log('healthTimeMs', hero.regen.healthTimeMs);
    console.log('manaTimeMs', hero.regen.manaTimeMs);
    if (hero.currentHealth < hero.maxHealth) {
      hero.regen.healthAcc += delta / hero.regen.healthTimeMs;

      const gain = Math.floor(hero.regen.healthAcc);
      if (gain > 0) {
        hero.currentHealth = Math.min(hero.currentHealth + gain, hero.maxHealth);
        hero.regen.healthAcc -= gain;
        const result = skillService.addExp(heroId, 'REGENERATION', gain);

        socketService.sendToClientExpResult({
          heroId,
          data: [{ isShowMessageOnlyLvlUp: true, expResult: result }],
        });
      }
    }

    if (hero.currentMana < hero.maxMana) {
      hero.regen.manaAcc += delta / hero.regen.manaTimeMs;

      const gain = Math.floor(hero.regen.manaAcc);
      if (gain > 0) {
        hero.currentMana = Math.min(hero.currentMana + gain, hero.maxMana);
        hero.regen.manaAcc -= gain;
        const result = skillService.addExp(heroId, 'MEDITATION', gain);

        socketService.sendToClientExpResult({
          heroId,
          data: [{ isShowMessageOnlyLvlUp: true, expResult: result }],
        });
      }
    }

    lastUpdate = now;
    console.log('HP', hero.currentHealth);
    console.log('HP ACC', hero.regen.healthAcc);
    console.log('MANA', hero.currentMana);
    console.log('MANA ACC', hero.regen.manaAcc);
    console.log('delta', delta);
  },
  heroOffline(heroId: string, now: number) {
    const hero = heroService.getHero(heroId);
    if (hero.offlineTimer && hero.offlineTimer <= now) {
      heroOffline(hero.id, hero.userId);
      console.log(` heroOffline ${hero.name}`);
    }
  },
};
