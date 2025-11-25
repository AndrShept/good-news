import { Building } from '@/shared/types';
import { create } from 'zustand';

interface IUseSelectBuildingStore {
  selectBuilding: Building | null;
  setSelectBuilding: (building: Building | null) => void;
}

export const useSelectBuildingStore = create<IUseSelectBuildingStore>((set) => ({
  selectBuilding: null,
  setSelectBuilding: (data) => set({ selectBuilding: data }),
}));
