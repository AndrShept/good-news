import { useSocket } from '@/components/providers/SocketProvider';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { useMapChunkEntitiesUpdate } from '@/features/map/hooks/useMapChunkEntitiesUpdate';
import { useSkillUpdate } from '@/features/skill/hooks/useSkillUpdate';
import { SelfHeroEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { Corpse, MapChunkEntitiesData, MapChunkEntitiesType, MapHero } from '@/shared/types';
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
  const { addItemInstance, updateItemInstance } = useItemContainerUpdate();
  const { updateEquip, removeEquip } = useEquipmentsUpdate();
  const mapId = useHero((data) => data?.location.mapId ?? '');
  const { removeChunkEntities, addChunkEntities } = useMapChunkEntitiesUpdate(mapId);
  const backpackId = useGetBackpackId();
  const heroId = useHeroId();
  const setGameMessage = useSetGameMessage();
  useEffect(() => {
    const listener = async (data: SelfHeroEvent) => {
      switch (data.type) {
        case 'REMOVE_BUFF':
          updateHero({ ...data.payload.hero });
          removeBuff(data.payload.buffInstanceId);
          break;
        case 'SKILL_EXP_UP':
          for (const updateData of data.payload) {
            updateSkill(updateData.expResult.skillInstanceId, {
              level: updateData.expResult.level,
              currentExperience: updateData.expResult.currentExperience,
              expToLvl: updateData.expResult.expToLvl,
            });
            if (!updateData.isShowMessageOnlyLvlUp || updateData.expResult.isLevelUp) {
              setGameMessage({ type: 'SKILL_EXP', text: updateData.expResult.message, expAmount: updateData.expResult.expAmount });
            }
          }
          break;
        case 'UPDATE_HERO':
          updateHero({ ...data.payload });
          break;

        case 'FINISH_GATHERING':
          updateHero({ gatheringFinishAt: undefined, state: 'IDLE' });
          setGameMessage({
            type: data.payload.itemName ? 'SUCCESS' : 'ERROR',
            text: data.payload.message,
            data: data.payload.itemName ? [{ name: data.payload.itemName, quantity: data.payload.quantity }] : undefined,
          });
          if (data.payload.inventoryDeltas && data.payload.itemName) {
            for (const i of data.payload.inventoryDeltas) {
              switch (i.type) {
                case 'CREATE':
                  addItemInstance(i.itemContainerId ?? '', i.item);
                  break;
                case 'UPDATE':
                  updateItemInstance(i.itemContainerId ?? '', i.itemInstanceId, i.updateData);
                  break;
              }
            }
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
                    type: 'ERROR',
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
    updateItemInstance,
    updateSkill,
  ]);
};
