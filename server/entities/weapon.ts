import type { GameItem } from '@/shared/types';

import type { gameItemTable, weaponTable } from '../db/schema';

const weaponName = ['broadsword'] as const;

type WeaponNameType = (typeof weaponName)[number];

export const weaponEntities: Record<WeaponNameType, typeof gameItemTable.$inferInsert & { weapon: typeof weaponTable.$inferInsert }> = {
  broadsword: {
    id: '019a2642-10ce-7ee8-ab1b-19674d19536f',
    name: 'Broadsword',
    image: '/sprites/equipments/swords/Icon1.jpg',
    type: 'WEAPON',

    weapon: {
      gameItemId: '',
      minDamage: 10,
      maxDamage: 20,
      weaponHand: 'ONE_HANDED',
      weaponType: 'SWORD',
      physCritChance: 10,
    },
  },
};
