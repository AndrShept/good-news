import { IPosition, Map, MapNameType, Tile } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getMapOptions } from '../api/get-map';

export const useChangeMap = (mapId: string) => {
  const queryClient = useQueryClient();

  const changeMap = useCallback(
    ({ params }: { params: Partial<Map> }) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData) return;
        return { ...oldData, ...params };
      });
    },
    [mapId, queryClient],
  );

  const changeTilePos = useCallback(
    (tileId: string, position: IPosition) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData?.tiles) return;
        return {
          ...oldData,
          tiles: oldData.tiles.map((tile) => (tile.id === tileId ? { ...tile, x: position.x, y: position.y } : tile)),
        };
      });
    },
    [mapId, queryClient],
  );

  const removeTile = useCallback(
    ({ tileId }: { tileId: string }) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData?.tiles) return;
        return { ...oldData, tiles: oldData.tiles.filter((tile) => tile.id !== tileId) };
      });
    },
    [mapId, queryClient],
  );
  const addTile = useCallback(
    (newTile: Tile) => {
      queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
        if (!oldData?.tiles) return;
        return { ...oldData, tiles: [...oldData.tiles, newTile] };
      });
    },
    [mapId, queryClient],
  );

  return {
    changeMap,
    removeTile,
    changeTilePos,
    addTile,
  };
};
