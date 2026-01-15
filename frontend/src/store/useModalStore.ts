import { ItemInstance, ItemTemplate } from '@/shared/types';
import { create } from 'zustand';

interface ModalData {
  type: ModalType;
  id: string;
  itemInstance?: ItemInstance & { itemTemplate: ItemTemplate };
}

interface IUseModalStore {
  modalData: ModalData | null;
  setModalData: (data: ModalData | null) => void;
}

const modalTypes = ['BANK_CHANGE_NAME', 'BANK_CHANGE_COLOR', 'DELETE_ITEM_INSTANCE'] as const;
type ModalType = (typeof modalTypes)[number];

export const useModalStore = create<IUseModalStore>((set) => ({
  modalData: null,
  setModalData: (data) => set({ modalData: data }),
}));
