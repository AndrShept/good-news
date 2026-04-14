import { create } from 'zustand';

interface ShopItemCard {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  itemInstanceId?: string;
  maxQuantity?: number;
}

interface UseShopItemStore {
  items: ShopItemCard[];

  getTotalPrice: () => number;
  getTotalQuantity: () => number;

  clearAllItems: () => void;
  addShopItem: (newItem: ShopItemCard) => void;
  removeShopItemByInstanceId: (instanceId: string) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
}

export const useShopItemStore = create<UseShopItemStore>((set, get) => ({
  items: [],

  totalPrice: 0,
  totalQuantity: 0,

  clearAllItems: () => set(() => ({ items: [] })),
  addShopItem: (newItem) =>
    set((state) => {
      if (newItem.itemInstanceId) {
        const exists = state.items.some((i) => i.itemInstanceId === newItem.itemInstanceId);
        if (exists) return { items: state.items };
        return { items: [...state.items, newItem] };
      }

      const exists = state.items.some((i) => i.id === newItem.id);
      if (exists) {
        return { items: state.items.map((i) => (i.id === newItem.id ? { ...i, quantity: i.quantity + 1 } : i)) };
      }
      return { items: [...state.items, newItem] };
    }),
  removeShopItemByInstanceId: (instanceId: string) =>
    set((state) => ({ items: state.items.filter((i) => i.itemInstanceId !== instanceId) })),
  increment: (id: string) =>
    set((state) => ({
      items: state.items.map((i) => {
        if (i.id === id && !i.itemInstanceId) {
          return { ...i, quantity: i.quantity + 1 };
        }
        return i;
      }),
    })),
  decrement: (id: string) =>
    set((state) => ({ items: state.items.map((i) => (i.id === id ? { ...i, quantity: i.quantity - 1 } : i)).filter((i) => !!i.quantity) })),
  getTotalPrice: () => get().items.reduce((acc, i) => acc + i.quantity * i.price, 0),
  getTotalQuantity: () => get().items.reduce((acc, i) => acc + i.quantity, 0),
}));
