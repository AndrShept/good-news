import { create } from 'zustand';

interface IUseCraftItemStore {
  coreResourceId: string | undefined;
  setCoreResourceId: (id: string | undefined) => void;
  recipeId: string | undefined;
  setRecipeId: (id: string | undefined) => void;
}

export const useCraftItemStore = create<IUseCraftItemStore>((set) => ({
  coreResourceId: undefined,
  setCoreResourceId: (id) => set({ coreResourceId: id }),
  recipeId: undefined,
  setRecipeId: (id) => set({ recipeId: id }),
}));
