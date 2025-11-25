import type { Building, BuildingType } from '@/shared/types';

import { imageConfig } from '../../frontend/src/lib/config';

export const buildingEntities: Record<BuildingType, Building> = {
  'MAGIC-SHOP': {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'Magic Shop',
    type: 'MAGIC-SHOP',
    image: imageConfig.icon.building['magic-shop'],
  },
  TEMPLE: {
    id: '0198c1b2-a9ac-7005-bd8b-ab6014b86374',
    name: 'Temple',
    type: 'TEMPLE',
    image: imageConfig.icon.building.temple,
  },
  BLACKSMITH: {
    id: '019aa81a-8a32-73df-800a-fcc28ef44821',
    name: 'Blacksmith',
    type: 'BLACKSMITH',
    image: imageConfig.icon.building.blacksmith,
  },
  FORGE: {
    id: '019aa81b-95fa-773d-a54a-f1b57745444a',
    name: 'Forge',
    type: 'FORGE',
    image: imageConfig.icon.building.forge,
  },
};
