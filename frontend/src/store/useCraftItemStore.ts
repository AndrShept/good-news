import { CraftItem, Resource, ResourceType } from '@/shared/types';
import { create } from 'zustand';

interface IUseCraftItemStore {
  baseResourceType: ResourceType | null;
  setBaseResource: (type: ResourceType | null) => void;
  craftItem: CraftItem | null | undefined;
  setCraftItem: (craftItem: CraftItem | null | undefined) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  baseResourceType: null,
  setBaseResource: (type) => set({ baseResourceType: type }),
  craftItem: null,
  setCraftItem: (craftItem) => set({ craftItem }),
}));
