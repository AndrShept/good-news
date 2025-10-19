import { Equipment, GameItem, InventoryItem, SuccessResponse } from '@/shared/types';
import { create } from 'zustand';

export const gameMessageType = {
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
  success: 'SUCCESS',
} as const;

export type GameMessageType = keyof typeof gameMessageType;
export interface IGameMessage {
  text: string;
  data?: { gameItemName: string; quantity?: number };
  success?: boolean;
  type: GameMessageType;
  createdAt?: number;
}
interface GameMessagesStore {
  gameMessages: IGameMessage[];
  setGameMessage: (newMessage: IGameMessage) => void;
  clearGameMessage: () => void;
}

export const useGameMessages = create<GameMessagesStore>((set) => ({
  gameMessages: [],
  setGameMessage: (newMessage) => set((state) => ({ gameMessages: [...state.gameMessages, { ...newMessage, createdAt: Date.now() }] })),
  clearGameMessage: () => set({ gameMessages: [] }),
}));

export const useSetGameMessage = () => useGameMessages((state) => state.setGameMessage);
