import type { GameItem } from '@/shared/types';

import type { gameItemTable, weaponTable } from '../db/schema';

const weaponName = ['broadsword', 'kryss'] as const;

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
  kryss: {
    id: 'bf087b8d-1313-48de-b995-e6a2c7e60fdd',
    name: 'kryss',
    image: '/sprites/equipments/swords/Icon2.jpg',
    type: 'WEAPON',

    weapon: {
      gameItemId: '',
      minDamage: 7,
      maxDamage: 15,
      weaponHand: 'ONE_HANDED',
      weaponType: 'DAGGER',
      physCritChance: 15,
      physHitChance: 20,
    },
  },
};
