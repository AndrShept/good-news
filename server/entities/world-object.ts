import type { WorldObjectName } from '@/shared/types';

import type { worldObject } from '../db/schema';

type WorldObject = typeof worldObject.$inferInsert;

export const worldObjectEntities: Record<WorldObjectName, WorldObject> = {
  SOLMERE: {
    name: 'SOLMERE',
    image: '/sprites/map/solmer-image/010.png',
    type: 'TOWN',
  },
};
