import { ItemInstance } from "@/shared/types";
import { create } from "zustand";

interface IUseDragcontainerStore {
  itemInstance: ItemInstance | null
  setItemInstance: (itemInstance: ItemInstance) => void
}

export const useDragContainerStore = create<IUseDragcontainerStore>((set) => ({


  itemInstance: null,
  setItemInstance: (item) => set({ itemInstance: item })
}))
