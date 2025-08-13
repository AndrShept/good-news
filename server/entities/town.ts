import type { TownNameType } from '@/shared/types';
import { randomUUIDv7 } from 'bun';

import type { townTable } from '../db/schema';

type Town = typeof townTable.$inferInsert;

export const town: Record<TownNameType, Town> = {
  SOLMERE: {
    name: 'SOLMERE',
    image: '/sprites/map/solmer-image/010.png',
  },
};
