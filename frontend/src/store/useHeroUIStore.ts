import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type HeroUIType = 'CHARACTER';
interface HeroUIStore {
  uiType: HeroUIType | null;
  setUiType: (type: HeroUIType | null) => void;
}

export const useHeroUIStore = create<HeroUIStore>()(
  persist(
    (set) => ({
      uiType: null,
      setUiType: (type) => set({ uiType: type }),
    }),
    {
      name: 'hero-ui',
    },
  ),
);
