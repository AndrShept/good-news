import { useSocket } from '@/components/providers/SocketProvider';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useMapChunkEntitiesUpdate } from '@/features/map/hooks/useMapChunkEntitiesUpdate';
import { useSkill } from '@/features/skill/hooks/useSkill';
import { useSkillUpdate } from '@/features/skill/hooks/useSkillUpdate';
import { SelfHeroEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { skillTemplateById } from '@/shared/templates/skill-template';
import { MapChunkEntitiesData } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useBuff } from './useBuff';
import { useEquipmentsUpdate } from './useEquipmentsUpdate';
import { useHero } from './useHero';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const { updateHero } = useHeroUpdate();
  const { updateSkill } = useSkillUpdate();
  const { addItemInstance, updateItemInstance, updateItemByDeltaEvents } = useItemContainerUpdate();
  const { updateEquip, removeEquip } = useEquipmentsUpdate();
  const mapId = useHero((data) => data?.location.mapId ?? '');
  const { removeChunkEntities, addChunkEntities } = useMapChunkEntitiesUpdate(mapId);
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const setGameMessage = useSetGameMessage();
  const { skills } = useSkill();

  useEffect(() => {
    const listener = async (data: SelfHeroEvent) => {
      switch (data.type) {
        case 'REMOVE_BUFF':
          updateHero({ ...data.payload.hero });
          removeBuff(data.payload.buffInstanceId);
          break;
        case 'SKILL_EXP_GAIN':
          for (const updateData of data.payload) {
            updateSkill(updateData.expResult.skillInstanceId, {
              level: updateData.expResult.level,
              currentExperience: updateData.expResult.currentExperience,
              expToLvl: updateData.expResult.expToLvl,
            });
            const skillInstance = skills?.find((s) => s.id === updateData.expResult.skillInstanceId);
            if (!skillInstance) continue;
            const skillTemplate = skillTemplateById[skillInstance.skillTemplateId];

            const increment = updateData.expResult.level - skillInstance.level;
            if (!updateData.isShowMessageOnlyLvlUp) {
              setGameMessage({ color: 'BLUE', text: updateData.expResult.message });
            }
            if (updateData.expResult.isLevelUp) {
              const text = `Your skill in ${skillTemplate.name} has increased by ${increment.toFixed(1)}. It is now ${updateData.expResult.level.toFixed(1)} 🔥`;
              setGameMessage({ color: 'BLUE', text });
            }
          }
          break;
        case 'UPDATE_HERO':
          updateHero({ ...data.payload });
          break;

        case 'FINISH_GATHERING':
          updateHero({ gatheringFinishAt: undefined, state: 'IDLE' });
          setGameMessage({
            color: data.payload.itemName ? 'GREEN' : 'RED',
            text: data.payload.message,
            data: data.payload.itemName ? [{ name: data.payload.itemName, quantity: data.payload.quantity }] : undefined,
          });
          if (data.payload.inventoryDeltas && data.payload.itemName) {
            updateItemByDeltaEvents(data.payload.inventoryDeltas);
          }
          if (data.payload.equipmentDeltas) {
            for (const e of data.payload.equipmentDeltas) {
              switch (e.type) {
                case 'UPDATE':
                  updateEquip(e.itemInstanceId, { ...e.updateData });
                  break;
                case 'DELETE':
                  removeEquip(e.itemInstanceId);
                  setGameMessage({
                    color: 'RED',
                    text: `Your ${e.itemName}  has broken! `,
                  });
                  break;
              }
            }
          }

          break;

        case 'LOAD_MORE_ENTITY': {
          const corpses = { type: 'CORPSE', payload: data.payload.corpses } as MapChunkEntitiesData;
          const creatures = { type: 'CREATURE', payload: data.payload.creatures } as MapChunkEntitiesData;
          const heroes = { type: 'HERO', payload: data.payload.heroes } as MapChunkEntitiesData;

          if (corpses.payload.length) {
            addChunkEntities(corpses);
          }
          if (creatures.payload.length) {
            addChunkEntities(creatures);
          }
          if (heroes.payload.length) {
            addChunkEntities(heroes);
          }

          break;
        }
        case 'REMOVE_OLD_ENTITY':
          if (data.payload.corpses.length) {
            removeChunkEntities(data.payload.corpses, 'CORPSE');
          }
          if (data.payload.creatures.length) {
            removeChunkEntities(data.payload.creatures, 'CREATURE');
          }
          if (data.payload.heroes.length) {
            removeChunkEntities(data.payload.heroes, 'HERO');
          }

          break;

        case 'ITEM_DELTA':
          updateItemByDeltaEvents(data.payload.itemsDelta);
          break;
      }
    };

    socket.on(socketEvents.selfData(), listener);

    return () => {
      socket.off(socketEvents.selfData(), listener);
    };
  }, [
    addChunkEntities,
    addItemInstance,
    heroId,
    removeBuff,
    removeChunkEntities,
    removeEquip,
    setGameMessage,
    socket,
    updateEquip,
    updateHero,
    updateItemByDeltaEvents,
    updateItemInstance,
    updateSkill,
  ]);
};
