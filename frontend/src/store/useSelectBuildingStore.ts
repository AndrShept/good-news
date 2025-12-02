import { Building } from '@/shared/types';
import { create } from 'zustand';

interface IUseSelectBuildingStore {
  selectBuilding: Building | null;
  setSelectBuilding: (building: Building | null) => void;
 isCraftBuilding: () => boolean; 
}

export const useSelectBuildingStore = create<IUseSelectBuildingStore>((set, get) => ({
  selectBuilding: null,
  setSelectBuilding: (data) => set({ selectBuilding: data }),
  isCraftBuilding: () => {
    const b = get().selectBuilding;
    return b?.type === 'BLACKSMITH' || b?.type === 'FORGE';
  },
}));
