import { Equipment, GameItem, InventoryItem, SuccessResponse } from '@/shared/types';
import { create } from 'zustand';

export const gameMessageType = {
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
  success: 'SUCCESS',
} as const;
export interface IGameMessage {
  text: string;
  data?: InventoryItem | Equipment;
  success?: boolean;
  type: keyof typeof gameMessageType;
  createdAt?: number;
}
interface GameMessagesStore {
  gameMessages: IGameMessage[];
  setGameMessage:(newMessage: IGameMessage) => void;
  clearGameMessage: () => void;
}

export const useGameMessages = create<GameMessagesStore>((set) => ({
  gameMessages: [],
  setGameMessage: (newMessage) => set((state) => ({ gameMessages: [...state.gameMessages, { ...newMessage, createdAt: Date.now()  }] })),
  clearGameMessage: () => set({ gameMessages: [] }),
}));

export const useSetGameMessage = () => useGameMessages((state) => state.setGameMessage);
