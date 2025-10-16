import type { gameItemTable, potionTable } from '../db/schema';
import type { resourceTable } from '../db/schema/resource-schema';

export const resourceEntities: (typeof gameItemTable.$inferInsert & { resource: typeof resourceTable.$inferInsert })[] = [
  {
    id: '0199df54-be65-7db2-af0a-1002d323d64d',
    name: 'Iron ore',
    image: '/sprites/ores/iron-ore.png',
    type: 'RESOURCES',
    resource: {
      gameItemId: '',
      type: 'IRON',
      category: 'ORE',
      rarity: 'COMMON',
      modifier: [
        {
          maxHealth: 10,
        },
      ],
    },
  },
  {
    id: '0199df74-c722-7695-96d9-59a701689d03',
    name: 'Copper ore',
    image: '/sprites/ores/copper-ore.png',
    type: 'RESOURCES',
    resource: {
      gameItemId: '',
      type: 'COPPER',
      category: 'ORE',
      rarity: 'COMMON',
      modifier: [
        {
          defense: 10,
        },
      ],
    },
  },
];
