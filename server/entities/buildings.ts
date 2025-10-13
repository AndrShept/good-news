import type { Building, BuildingType } from '@/shared/types';

export const buildingEntities: Record<BuildingType, Building> = {
  'MAGIC-SHOP': {
    id: '0198c15a-149a-7cb5-bbf2-bf8ddd2c9f98',
    name: 'Magic Shop',
    type: 'MAGIC-SHOP',
    image: '/sprites/buildings/magic-shop.png',
    
  },
  TEMPLE: {
    id: '0198c1b2-a9ac-7005-bd8b-ab6014b86374',
    name: 'Temple',
    type: 'TEMPLE',
    image: '/sprites/buildings/temple.png',
  },
};
