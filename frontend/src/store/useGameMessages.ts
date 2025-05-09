import { create } from 'zustand';

export const gameMessageType = {
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
  success: 'SUCCESS',
} as const;
export interface IGameMessage<T = unknown> {
  text: string;
  data?: T | null;
  success?: boolean;
  type: keyof typeof gameMessageType;
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
