import { NPCType, NpcTabType } from '@/shared/types';
import { create } from 'zustand';

export const NPC_EMPTY_MESSAGES: Record<NPCType, Record<NpcTabType, string>> = {
  ALCHEMIST: {
    BUY: "My shelves are bare for now. Come back when I've restocked.",
    SELL: "I have no use for what you're carrying. Bring me herbs, mushrooms or flowers.",
    QUEST: 'I have nothing for you today. Check back later.',
  },
  BLACKSMITH: {
    BUY: 'The forge is cold today — nothing ready to sell just yet.',
    SELL: 'I only deal in quality ingots and ore. Bring me something worth my time.',
    QUEST: 'No work for you at the moment. The forge keeps me busy enough.',
  },
  COOK: {
    BUY: "The kitchen is empty today. Come back when the fire's going.",
    SELL: "I'm not buying that. Bring me something fresh — fish, herbs, anything edible.",
    QUEST: 'Nothing to ask of you today, dear. Enjoy the quiet.',
  },
  INSCRIBER: {
    BUY: "Every scroll has been claimed. I'm expecting a new shipment soon.",
    SELL: "I only collect knowledge worth preserving. This isn't it.",
    QUEST: 'My research is at a standstill. No tasks for you right now.',
  },
  TINKER: {
    BUY: 'Sold out — good tools go fast. Check back tomorrow.',
    SELL: "I don't need what you have. Bring me something I can work with.",
    QUEST: 'Nothing broken, nothing needed. Come back when that changes.',
  },
};
interface UseNpcMessageStore {
  message: string;
  setNpcMessage: (msg: string) => void;
  getEmptyMessage: (data: { npcType: NPCType; npcTab: NpcTabType }) => void;
}
export const useNpcMessageStore = create<UseNpcMessageStore>((set) => ({
  message: '',
  setNpcMessage: (msg) => set({ message: msg }),
  getEmptyMessage: ({ npcTab, npcType }) => set({ message: NPC_EMPTY_MESSAGES[npcType][npcTab] }),
}));
