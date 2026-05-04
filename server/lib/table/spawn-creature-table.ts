import { type CreatureKey } from '@/shared/templates/creature-template';
import type { SpawnPoint } from '@/shared/types';

export const SPAWN_CREATURE_TABLE: Partial<Record<string, Pick<SpawnPoint, 'radius' | 'maxCreatures' | 'respawnTime'>>> = {
  PIG: { maxCreatures: 5, radius: 5, respawnTime: 10000 },
  SHEEP: { maxCreatures: 10, radius: 5, respawnTime: 20000 },
  RAT: { maxCreatures: 3, radius: 5, respawnTime: 20000 },
};
