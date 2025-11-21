import type { Building, Place } from '@/shared/types';

import { buildingEntities } from './buildings';

export const placeEntities: Place[] = [
  {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'Solmer Town',
    type: 'TOWN',
    image: '/sprites/places/solmer.webp',
    x: 7,
    y: 7,
    buildings: [buildingEntities['MAGIC-SHOP'], buildingEntities.TEMPLE, buildingEntities.BLACKSMITH],
    mapId: '019a350c-5552-76dd-b6d5-181b473d3128',
    createdAt: new Date().toISOString(),
  },
  {
    id: '0199df1f-88e5-747c-b54b-afe86110b246',
    name: 'Mine',
    type: 'MINE',
    image: '/sprites/places/mine.png',
    x: 10,
    y: 10,
    mapId: '019a350c-5552-76dd-b6d5-181b473d3128',
    buildings: [buildingEntities.FORGE],
    createdAt: new Date().toISOString(),
  },
];
