import type { ItemTemplate } from '@/shared/types';

export const weaponTemplate = [
  {
    id: '019a2642-10ce-7ee8-ab1b-19674d19536f',
    name: 'broadsword',
    key: 'broadsword',
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
] as const satisfies ItemTemplate[];

const weaponKeys = weaponTemplate.map((w) => w.key);

type WeaponKeyType = (typeof weaponKeys)[number];
export const weaponTemplateByKey = weaponTemplate.reduce(
  (acc, item) => {
    acc[item.key] = item;

    return acc;
  },
  {} as Record<WeaponKeyType, ItemTemplate>,
);
