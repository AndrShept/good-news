import type { armorTable, gameItemTable, weaponTable } from '../db/schema';

export const armorEntities: Array<typeof gameItemTable.$inferInsert & { armor: typeof armorTable.$inferInsert }> = [
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
      slot: 'CHESTPLATE',
    },
    craftInfo: {
      craftTIme: 10_000,
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
      slot: 'GLOVES',
    },
      craftInfo: {
      craftTIme: 10_000,
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
      slot: 'GLOVES',
    },
      craftInfo: {
      craftTIme: 10_000,
      baseResourceCategory: 'INGOT',
      requiredBuildingType: 'BLACKSMITH',
    },
  },
];
