import { Layer } from '@/shared/json-types';
import { IPosition } from '@/shared/types';
import { buildPathWithObstacles } from '@/shared/utils';
import { create } from 'zustand';

interface SetMovementPathTiles {
  heroWorldX: number;
  heroWorldY: number;
  heroTargetX: number;
  heroTargetY: number;
  offsetX: number;
  offsetY: number;
  MAP_WIDTH: number;
  MAP_HEIGHT: number;
  layers: Layer[];
}

interface IUseMovementPathTileStore {
  movementPathTiles: IPosition[];
  setMovementPathTiles: (data: SetMovementPathTiles) => void;
  clearMovementPathTiles: () => void;
  filterMovementPathTiles: (pos: IPosition) => void;
}

export const useMovementPathTileStore = create<IUseMovementPathTileStore>((set) => ({
  movementPathTiles: [],
  clearMovementPathTiles: () => set({ movementPathTiles: [] }),
  setMovementPathTiles: ({ MAP_HEIGHT, MAP_WIDTH, heroTargetX, heroTargetY, heroWorldX, heroWorldY, layers, offsetX, offsetY }) => {
    const from = {
      x: heroWorldX - offsetX,
      y: heroWorldY - offsetY,
    };

    const to = {
      x: heroTargetX ,
      y: heroTargetY ,
    };

    const path = buildPathWithObstacles(from, to, layers, MAP_WIDTH, MAP_HEIGHT);

    const worldPath = path.map((p) => ({
      x: p.x + offsetX,
      y: p.y + offsetY,
    }));
    set({ movementPathTiles: worldPath });
  },
  filterMovementPathTiles: (data) =>
    set(({ movementPathTiles }) => ({
      movementPathTiles: movementPathTiles.filter((p) => !(p.x === data.x && p.y === data.y)),
    })),
}));
