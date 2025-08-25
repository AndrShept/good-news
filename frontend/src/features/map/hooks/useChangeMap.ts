import { Map, MapNameType, Tile } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getMapOptions } from '../api/get-map';

export const useChangeMap = (mapId: string) => {
  const queryClient = useQueryClient();

  const changeMap = ({ params }: { params: Partial<Map> }) => {
    queryClient.setQueriesData<Map>(
      {
        queryKey: getMapOptions(mapId).queryKey,
      },
      (oldData) => {
        if (!oldData) return;
        return { ...oldData, ...params };
      },
    );
  };

  const changeTile = ({ params, tileId }: { params: Partial<Tile>; tileId: string }) => {
    queryClient.setQueriesData<Map>(
      {
        queryKey: getMapOptions(mapId).queryKey,
      },
      (oldData) => {
        if (!oldData || !oldData.tiles) return;
        return { ...oldData, tiles: oldData.tiles.map((tile) => (tile.id === tileId ? { ...tile, ...params } : tile)) };
      },
    );
  };
  const removeTile = ({ tileId }: { tileId: string }) => {
    queryClient.setQueriesData<Map>(
      {
        queryKey: getMapOptions(mapId).queryKey,
      },
      (oldData) => {
        if (!oldData || !oldData.tiles) return;
        return { ...oldData, tiles: oldData.tiles.filter((tile) => tile.id !== tileId) };
      },
    );
  };

  return {
    changeMap,
    changeTile,
    removeTile,
  };
};
