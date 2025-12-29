import { IPosition } from '@/shared/types';
import { create } from 'zustand';

interface IUseMovementPathTileStore {
  movementPathTiles: IPosition[];
  setMovementPathTiles: (data: IPosition[]) => void;
  filterMovementPathTiles: (pos: IPosition) => void;
}

export const useMovementPathTileStore = create<IUseMovementPathTileStore>((set) => ({
  movementPathTiles: [],
  setMovementPathTiles: (data) => set({ movementPathTiles: data }),
  filterMovementPathTiles: (data) =>
    set(({ movementPathTiles }) => ({
      movementPathTiles: movementPathTiles.filter((p) => !(p.x === data.x && p.y === data.y)),
    })),
}));
