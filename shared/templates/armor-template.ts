import type { ItemTemplate } from '@/shared/types';

export const armorTemplate = [
  {
    id: 'e0785970-3c64-4187-b00b-13e3c3f34f55',
    name: 'plate armor',
    image: '/sprites/equipments/breastplates/Icon1.jpg',
    key: 'plate_armor',
    type: 'ARMOR',
    stackable: false,
    equipInfo: {
      armorType: 'CHEST',
      armorCategory: 'PLATE',
    },
    coreModifier: {
      armor: 20,
      evasion: -30,
      constitution: 10
    },
  },
] as const satisfies ItemTemplate[];
