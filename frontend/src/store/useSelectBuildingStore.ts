import { Building, Npc } from '@/shared/types';
import { create } from 'zustand';

type SelectedPlaceEntities =
  | {
      type: 'NPC';
      payload: Npc;
    }
  | {
      type: 'BUILDING';
      payload: Building;
    };

interface UseSelectPlaceEntitiesStore {
  selectedPlaceEntities: SelectedPlaceEntities | null;
  setSelectedPlaceEntities: (data: SelectedPlaceEntities | null) => void;
}

export const useSelectPlaceEntitiesStore = create<UseSelectPlaceEntitiesStore>((set, get) => ({
  selectedPlaceEntities: null,
  setSelectedPlaceEntities: (data) => set({ selectedPlaceEntities: data }),
}));
