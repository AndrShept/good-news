import { IPosition } from '@/shared/types';
import { create } from 'zustand';

interface IUseMovementPathTileStore {
  movementPathTiles: IPosition[];
  setMovementPathTiles: (data: IPosition[]) => void;
}

export const useMovementPathTileStore = create<IUseMovementPathTileStore>((set) => ({
  movementPathTiles: [],
  setMovementPathTiles: (data) => set({ movementPathTiles: data }),
}));
