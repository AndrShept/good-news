import type { itemTemplateTable } from '../db/schema';

export const weaponTemplate = [
  {
    id: '019a2642-10ce-7ee8-ab1b-19674d19536f',
    name: 'broadsword',
    image: '/sprites/equipments/swords/Icon1.jpg',
    type: 'WEAPON',
    stackable: false,
    equipInfo: {
      weaponHand: 'ONE_HANDED',
      weaponType: 'SWORD',
    },
    coreModifier: {
      minDamage: 10,
      maxDamage: 17,
    },
  },
] as const satisfies (typeof itemTemplateTable.$inferInsert)[];
