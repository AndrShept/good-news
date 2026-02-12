import { GameSysMessage } from '@/shared/types';
import { create } from 'zustand';


interface GameMessagesStore {
  gameMessages: GameSysMessage[];
  setGameMessage: (newMessage: GameSysMessage) => void;
  clearGameMessage: () => void;
}

export const useGameMessages = create<GameMessagesStore>((set) => ({
  gameMessages: [],
  setGameMessage: (newMessage) => set((state) => ({ gameMessages: [...state.gameMessages, { ...newMessage, createdAt: Date.now() }] })),
  clearGameMessage: () => set({ gameMessages: [] }),
}));

export const useSetGameMessage = () => useGameMessages((state) => state.setGameMessage);
