import { BattleLogMessage } from '@/shared/types';
import { create } from 'zustand';

interface GameMessagesStore {
  logs: BattleLogMessage[];
  setBattleLog: (log: BattleLogMessage) => void;
  clearBattleLog: () => void;
}

export const useBattleLog = create<GameMessagesStore>((set) => ({
  logs: [],

  setBattleLog: (log) => set((state) => ({ logs: [...state.logs, { ...log, createdAt: Date.now() }] })),
  clearBattleLog: () => set({ logs: [] }),
}));
