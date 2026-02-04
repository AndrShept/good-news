import { create } from 'zustand';

export const gameMessageObj = {
  info: 'INFO',
  warning: 'WARNING',
  error: 'ERROR',
  success: 'SUCCESS',
  skillExp: 'SKILL_EXP',
  levelExp: 'LEVEL_EXP',
} as const;

export const gameMessageValues = Object.values(gameMessageObj);

export type GameMessageType = (typeof gameMessageValues)[number];
export interface IGameMessage {
  text: string;
  data?: { name: string; quantity?: number }[];
  expAmount?: number;
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
