import type { ItemTemplate } from '@/shared/types';

export const shieldTemplate = [
  {
    id: '019bbdf3-a7e0-7b99-b922-da506c0b76fe',
    name: 'regular shield',
    key: 'regular_shield',
    image: '/sprites/equipments/shields/Icon1.png',
    type: 'SHIELD',
    stackable: false,
    equipInfo: {
      armorType: 'SHIELD',
    },

    coreModifier: {
      armor: 20,
      evasion: -10,
    },
  },
] as const satisfies ItemTemplate[];
