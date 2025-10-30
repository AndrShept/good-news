import type { mapTable } from '../db/schema';

export const mapEntities: Record<string, typeof mapTable.$inferInsert> = {
  '019a350c-5552-76dd-b6d5-181b473d3128': {
    id: '019a350c-5552-76dd-b6d5-181b473d3128',
    height: 1,
    width: 1,
    tileHeight: 32,
    tileWidth: 32,
    image: '/sprites/map/solmer.png',
    name: 'Solmere Valley',
    pvpMode: 'PVE',
  },
};
