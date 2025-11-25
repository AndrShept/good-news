import { Resource, ResourceType } from '@/shared/types';
import { create } from 'zustand';

interface IUseCraftItemStore {
  baseResourceType: ResourceType | null;
  setBaseResource: (type: ResourceType) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  baseResourceType: null,
  setBaseResource: (type) => set({ baseResourceType: type }),
}));
