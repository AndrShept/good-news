import { create } from 'zustand';

interface ShopItemCard {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

interface UseShopItemStore {
  items: ShopItemCard[];
  isOpen: boolean;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  toggleIsOpen: () => void;
  onClose: () => void;
  clearAllItems: () => void;
  addShopItem: (newItem: ShopItemCard) => void;
  removeShopItem: (id: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
}

export const useShopItemStore = create<UseShopItemStore>((set, get) => ({
  items: [],
  isOpen: false,
  totalPrice: 0,
  totalQuantity: 0,
  onClose: () => set({ isOpen: false }),
  toggleIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  clearAllItems: () => set(() => ({ items: [] })),
  addShopItem: (newItem) =>
    set((state) => {
      if (state.items.some((i) => i.id === newItem.id)) {
        return { items: state.items.map((i) => (i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i)) };
      } else {
        return { items: [...state.items, newItem] };
      }
    }),
  removeShopItem: (id: string) => set((state) => ({ items: state.items.filter((i) => i.id === id) })),
  increment: (id: string) => set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i)) })),
  decrement: (id: string) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => !!i.quantity) })),
  getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.price, 0),
  getTotalQuantity: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
}));
