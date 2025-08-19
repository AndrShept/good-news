import type { Town, TownNameType } from '@/shared/types';

import { buildingEntities } from './buildings';

export const townEntities: Record<TownNameType, Town> = {
  SOLMERE: {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'SOLMERE',
    image: '/sprites/map/town/solmer.webp',
    createdAt: new Date().toISOString(),
    buildings: [buildingEntities.TEMPLE, buildingEntities['MAGIC-SHOP']],
  },
};
