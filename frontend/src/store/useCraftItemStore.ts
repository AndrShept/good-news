import { Resource, ResourceType } from '@/shared/types';
import { create } from 'zustand';

interface IUseCraftItemStore {
  selectedResourceType: ResourceType;
  setSelectedResource: (type: ResourceType) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  selectedResourceType: 'IRON',
  setSelectedResource: (type) => set({ selectedResourceType: type }),
}));
