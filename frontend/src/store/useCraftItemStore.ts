import { CoreMaterialType, ItemTemplate } from '@/shared/types';
import { create } from 'zustand';

interface IUseCraftItemStore {
  coreMaterialType: CoreMaterialType | null;
  setCoreMaterial: (type: CoreMaterialType | null) => void;
  craftItem: ItemTemplate | null | undefined;
  setCraftItem: (craftItem: CraftItem | null | undefined) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  coreMaterialType: null,
  setCoreMaterial: (type) => set({ coreMaterialType: type }),
  craftItem: null,
  setCraftItem: (craftItem) => set({ craftItem }),
}));
