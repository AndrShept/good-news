import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HeaderUIType = 'CHARACTER';
export type ConsoleTabType = 'SYS' | 'CHAT' | 'LOG';
export type ConsoleActiveTab = {
  active: ConsoleTabType;
  default: Extract<ConsoleTabType, 'SYS' | 'CHAT'>;
};

interface GameUIStore {
  headerUIType: HeaderUIType | null;
  setHeaderUIType: (type: HeaderUIType | null) => void;
  consoleTab: ConsoleActiveTab;
  setConsoleTab: (data: Partial<ConsoleActiveTab>) => void;
  isAutoZoneChecked: boolean;
  setIsAutoZoneChecked: (bool: boolean) => void;
}

export const useGameUIStore = create<GameUIStore>()(
  persist(
    (set) => ({
      headerUIType: null,
      setHeaderUIType: (type) => set({ headerUIType: type }),
      consoleTab: { active: 'SYS', default: 'SYS' },
      setConsoleTab: (data) => set((prev) => ({ consoleTab: { ...prev.consoleTab, ...data } })),
      isAutoZoneChecked: false,
      setIsAutoZoneChecked: (bool) => set({ isAutoZoneChecked: bool }),
    }),
    {
      name: 'game-ui',
    },
  ),
);
