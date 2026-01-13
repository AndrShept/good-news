import type { itemTemplateTable } from '../db/schema';

export const shieldTemplate = [
  {
    id: '019b2de0-0ec8-79b4-8e2e-a20d8623878a',
    name: 'regular shield',
    image: '/sprites/equipments/shields/Icon1.png',
    type: 'SHIELD',
    stackable: false,
    equipInfo: {
      armorType: 'SHIELD',
    },
    craftInfo: {
      baseResourceCategory: 'INGOT',
      requiredBuildingType: 'BLACKSMITH',
    },
    coreModifier: {
      defense: 20,
      evasion: -10,
    },
  },
] as const satisfies (typeof itemTemplateTable.$inferInsert)[];
