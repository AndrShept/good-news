import { create } from 'zustand';

interface IUseCraftItemStore {
<<<<<<<<< Temporary merge branch 1
  coreMaterialType: CoreMaterialType | null;
  setCoreMaterial: (type: CoreMaterialType | null) => void;
  craftItem: CraftItem | null;
  setCraftItem: (craftItem: CraftItem | null | undefined) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  coreMaterialType: null,
  setCoreMaterial: (type) => set({ coreMaterialType: type }),
  craftItem: null,

  setCraftItem: (craftItem) => set({ craftItem }),
=========
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
>>>>>>>>> Temporary merge branch 2
}));
