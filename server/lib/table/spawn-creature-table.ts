import { type CreatureKey, creatureTemplateById, creatureTemplateByKey } from '@/shared/templates/creature-template';
import type { SpawnPoint } from '@/shared/types';

export const SPAWN_CREATURE_TABLE = {
  PIG: { maxCreatures: 5, radius: 5, respawnTime: 10_000 },
  SHEEP: { maxCreatures: 10, radius: 5, respawnTime: 20_000 },
  RAT: { maxCreatures: 3, radius: 5, respawnTime: 20_000 },
} satisfies Record<CreatureKey, Pick<SpawnPoint, 'radius' | 'maxCreatures' | 'respawnTime'>>;
