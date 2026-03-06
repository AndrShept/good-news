import { MapChunkUpdateEntitiesData } from '@/shared/socket-data-types';
import { ApiGeChunkMapEntities, MapChunkEntitiesData, MapChunkEntitiesType } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getMapChunkEntitiesOptions } from '../api/get-map-heroes';

export const useMapChunkEntitiesUpdate = (mapId: string) => {
  const queryClient = useQueryClient();

  const updateChunkEntities = useCallback(
    ({ entityId, data }: MapChunkUpdateEntitiesData) => {
      queryClient.setQueriesData<ApiGeChunkMapEntities>({ queryKey: getMapChunkEntitiesOptions(mapId).queryKey }, (oldData) => {
    
        if (!oldData) return;
        switch (data.type) {
          case 'HERO':
            return { ...oldData, heroes: oldData.heroes.map((e) => (entityId === e.id ? { ...e, ...data.payload } : e)) };
          case 'CORPSE':
            return { ...oldData, corpses: oldData.corpses.map((e) => (entityId === e.id ? { ...e, ...data.payload } : e)) };
          case 'CREATURE':
            return { ...oldData, creatures: oldData.creatures.map((e) => (entityId === e.id ? { ...e, ...data.payload } : e)) };
        }
      });
    },
    [mapId],
  );
  const removeChunkEntities = useCallback(
    (entityId: string, type: MapChunkEntitiesType) => {
      queryClient.setQueriesData<ApiGeChunkMapEntities>({ queryKey: getMapChunkEntitiesOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;

        switch (type) {
          case 'HERO':
            return { ...oldData, heroes: oldData.heroes.filter((e) => entityId !== e.id) };
          case 'CORPSE':
            return { ...oldData, corpses: oldData.corpses.filter((e) => entityId !== e.id) };
          case 'CREATURE':
            return { ...oldData, creatures: oldData.creatures.filter((e) => entityId !== e.id) };
        }
      });
    },
    [mapId],
  );

  const addChunkEntities = useCallback(
    (data: MapChunkEntitiesData) => {
      queryClient.setQueriesData<ApiGeChunkMapEntities>({ queryKey: getMapChunkEntitiesOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;

        switch (data.type) {
          case 'HERO':
            if (oldData.heroes.some((e) => e.id === data.payload.id)) return;
            return { ...oldData, heroes: [...oldData.heroes, data.payload] };
          case 'CORPSE':
            if (oldData.corpses.some((e) => e.id === data.payload.id)) return;
            return { ...oldData, corpses: [...oldData.corpses, data.payload] };
          case 'CREATURE':
            if (oldData.creatures.some((e) => e.id === data.payload.id)) return;
            return { ...oldData, creatures: [...oldData.creatures, data.payload] };
        }
      });
    },
    [mapId],
  );

  return {
    updateChunkEntities,
    removeChunkEntities,
    addChunkEntities,
  };
};
