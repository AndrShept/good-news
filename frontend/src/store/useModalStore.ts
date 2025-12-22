import { create } from 'zustand';

interface ModalData {
  type: ModalType;
  id: string;
}

interface IUseModalStore {
  modalData: ModalData | null;
  setModalData: (data: ModalData | null) => void;
}

const modalTypes = ['BANK_CHANGE_NAME', 'BANK_CHANGE_COLOR'] as const;
type ModalType = (typeof modalTypes)[number];

export const useModalStore = create<IUseModalStore>((set) => ({
  modalData: null,
  setModalData: (data) => set({ modalData: data }),
}));
