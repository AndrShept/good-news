import type { Building, Town, TownNameType } from '@/shared/types';

import { buildingEntities } from './buildings';

interface OmitTown extends Omit<Town, 'buildings'> {
  buildings: { buildingsId: string }[];
}

export const townEntities: Record<TownNameType, OmitTown> = {
  SOLMERE: {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'SOLMERE',
    image: '/sprites/map/town/solmer.webp',
    x: 7,
    y: 7,
    createdAt: new Date().toISOString(),
    buildings: [{ buildingsId: buildingEntities.TEMPLE.id }, { buildingsId: buildingEntities['MAGIC-SHOP'].id }],
    mapId: '01998100-a29d-7b0f-abad-edd4ef317472',
  },
};
