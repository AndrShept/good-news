import type { WorldObjectName } from '@/shared/types';

import type { worldObjectTable } from '../db/schema';

type WorldObject = typeof worldObjectTable.$inferInsert;

export const worldObjectEntities: Record<WorldObjectName, WorldObject> = {
  SOLMERE: {
    name: 'SOLMERE',
    image: '/sprites/map/solmer-image/010.png',
    type: 'TOWN',
  },
};
