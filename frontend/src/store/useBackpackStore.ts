import { create } from 'zustand';

interface BackpackStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;

}

export const useBackpackStore = create<BackpackStore>((set) => ({
  isOpen: false,

  onOpen: () => set(({isOpen}) => ({ isOpen: !isOpen })),
  onClose: () => set({ isOpen: false }),

}));
