import type { armorTable, gameItemTable, shieldTable, weaponTable } from '../db/schema';

export const shieldEntities = [
  {
    id: '019b2de0-0ec8-79b4-8e2e-a20d8623878a',
    name: 'regular shield',
    image: '/sprites/equipments/shields/Icon1.png',
    type: 'SHIELD',

    shield: {
      gameItemId: '',
      defense: 30,
      evasion: -50,
      magicResistance: 0,
      maxHealth: 0,
      maxMana: 0,
      slot: 'SHIELD',
    },
    craftInfo: {
      baseResourceCategory: 'INGOT',
      requiredBuildingType: 'BLACKSMITH',
    },
  },
] as const satisfies Array<typeof gameItemTable.$inferInsert & { shield: typeof shieldTable.$inferInsert }>;
