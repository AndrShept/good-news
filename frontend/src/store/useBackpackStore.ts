import { create } from 'zustand';

interface UseSheetStore {
  isBackpackOpen: boolean;
  onBackpackToggle: () => void;
  onBackpackClose: () => void;
  isEntitySidebarOpen: boolean;
  onEntitySidebarToggle: () => void;
  onEntitySidebarClose: () => void;
}

export const useSheetStore = create<UseSheetStore>((set) => ({
  isBackpackOpen: false,
  onBackpackToggle: () => set(({ isBackpackOpen }) => ({ isBackpackOpen: !isBackpackOpen })),
  onBackpackClose: () => set({ isBackpackOpen: false }),
  isEntitySidebarOpen: false,
  onEntitySidebarToggle: () => set(({ isEntitySidebarOpen }) => ({ isEntitySidebarOpen: !isEntitySidebarOpen })),
  onEntitySidebarClose: () => set({ isEntitySidebarOpen: false }),
}));
