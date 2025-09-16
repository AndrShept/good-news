import { TPosition } from '@/shared/socket-data-types';
import { Hero, Map, MapNameType, Tile } from '@/shared/types';
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

  const filterHeroes = ({ pos, heroId }: { pos: TPosition; heroId: string }) => {
    queryClient.setQueriesData<Map>(
      {
        queryKey: getMapOptions(mapId).queryKey,
      },
      (oldData) => {
        if (!oldData || !oldData.tilesGrid) return;

        const { x, y } = pos;
        const oldTile = oldData.tilesGrid[y][x];
        if (!oldTile) return;
        const newTile = { ...oldTile, heroes: oldTile.heroes?.filter((h) => h.id !== heroId) };
        const newGrid = [...oldData.tilesGrid];
        newGrid[y] = [...newGrid[y]];
        newGrid[y][x] = newTile;
        return {
          ...oldData,
          tilesGrid: newGrid,
        };
      },
    );
  };
  const addHeroes = ({ pos, hero }: { pos: TPosition; hero: Hero }) => {
    queryClient.setQueriesData<Map>({ queryKey: getMapOptions(mapId).queryKey }, (oldData) => {
      if (!oldData || !oldData.tilesGrid) return;

      const { x, y } = pos;

      const oldTile = oldData.tilesGrid[y][x];
      if (!oldTile) return;
      const newTile = {
        ...oldTile,
        heroes: [...(oldTile.heroes ?? []), hero],
      };
      const newTilesGrid = [...oldData.tilesGrid];
      newTilesGrid[y] = [...newTilesGrid[y]];
      newTilesGrid[y][x] = newTile;

      return {
        ...oldData,
        tilesGrid: newTilesGrid,
      };
    });
  };

  return {
    changeMap,
    changeTile,
    removeTile,
    filterHeroes,
    addHeroes,
  };
};
