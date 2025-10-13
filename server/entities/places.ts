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
    buildings: [buildingEntities['MAGIC-SHOP'], buildingEntities.TEMPLE],
    mapId: '01998100-a29d-7b0f-abad-edd4ef317472',
    createdAt: new Date().toISOString(),
  },
  {
    id: '0199df1f-88e5-747c-b54b-afe86110b246',
    name: 'Mine',
    type: 'MINE',
    image: '/sprites/places/mine.png',
    x: 10,
    y: 10,
    mapId: '01998100-a29d-7b0f-abad-edd4ef317472',
    buildings: null,
    createdAt: new Date().toISOString(),
  },
];
