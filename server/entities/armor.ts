import type { armorTable, gameItemTable, weaponTable } from '../db/schema';

export const armorEntities = [
  {
    id: 'e0785970-3c64-4187-b00b-13e3c3f34f55',
    name: 'plate armor',
    image: '/sprites/equipments/breastplates/Icon1.jpg',
    type: 'ARMOR',

    armor: {
      gameItemId: '',
      defense: 20,
      evasion: -20,
      magicResistance: 5,
      maxHealth: 0,
      maxMana: 0,
      slot: 'CHEST',
      type: 'PLATE',
    },
    craftInfo: {
      baseResourceCategory: 'INGOT',
      requiredBuildingType: 'BLACKSMITH',
    },
  },
  {
    id: 'c0f02a83-17d9-4b5d-a6f7-8c0b6a2c2107',
    name: 'simple gloves',
    image: '/sprites/equipments/glovers/Icon1.jpg',
    type: 'ARMOR',

    armor: {
      gameItemId: '',
      evasion: 0,
      magicResistance: 0,
      defense: 6,
      maxHealth: 0,
      maxMana: 0,
      slot: 'GLOVES',
      type: 'PLATE',
    },
    craftInfo: {
      baseResourceCategory: 'INGOT',
      requiredBuildingType: 'BLACKSMITH',
    },
  },
] as const satisfies Array<typeof gameItemTable.$inferInsert & { armor: typeof armorTable.$inferInsert }>;
