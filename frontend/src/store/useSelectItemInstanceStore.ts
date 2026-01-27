import { ItemInstance } from '@/shared/types';
import { create } from 'zustand';

interface IUseSelectItemInstanceStore {
  itemInstance: ItemInstance | null;
  setItemInstance: (data: ItemInstance | null) => void;
}

export const useSelectItemInstanceStore = create<IUseSelectItemInstanceStore>((set) => ({
  itemInstance: null,
  setItemInstance: (data) => set({ itemInstance: data }),
}));


export const useSelectedItemId = () => 
  useSelectItemInstanceStore((state) => state.itemInstance?.id);

export const useSetSelectedItem = () => 
  useSelectItemInstanceStore((state) => state.setItemInstance);