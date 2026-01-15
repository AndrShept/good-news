import { CoreMaterialType, CraftItem } from '@/shared/types';
import { create } from 'zustand';

interface IUseCraftItemStore {
  coreMaterialId: string | undefined;
  setCoreMaterialId: (id: string | undefined) => void;
  recipeId: string | undefined;
  setRecipeId: (id: string | undefined) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  coreMaterialId: undefined,
  setCoreMaterialId: (id) => set({ coreMaterialId: id }),
  recipeId: undefined,
  setRecipeId: (id) => set({ recipeId: id }),
}));
