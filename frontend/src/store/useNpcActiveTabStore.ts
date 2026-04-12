import { NpcTabType } from '@/shared/types';
import { create } from 'zustand';

interface UseNpcActiveTabStore {
  npcActiveTab: NpcTabType | null;
  setNpcActiveTab: (type: NpcTabType | null) => void;
}

export const useNpcActiveTabStore = create<UseNpcActiveTabStore>((set) => ({
  npcActiveTab: null,
  setNpcActiveTab: (type) => set({ npcActiveTab: type }),
}));
