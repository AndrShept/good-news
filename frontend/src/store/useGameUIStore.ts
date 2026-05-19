import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HeaderUIType = 'CHARACTER';
export type ConsoleActiveTab = 'SYS' | 'CHAT' | 'LOG';

interface GameUIStore {
  headerUIType: HeaderUIType | null;
  setHeaderUIType: (type: HeaderUIType | null) => void;
  consoleActiveTab: ConsoleActiveTab;
  setConsoleActiveTab: (type: ConsoleActiveTab) => void;
}

export const useGameUIStore = create<GameUIStore>()(
  persist(
    (set) => ({
      headerUIType: null,
      setHeaderUIType: (type) => set({ headerUIType: type }),
      consoleActiveTab: 'SYS',
      setConsoleActiveTab: (type) => set({ consoleActiveTab: type }),
    }),
    {
      name: 'game-ui',
    },
  ),
);
