import { creatureTemplateById } from '@/shared/templates/creature-template';
import type { CreatureInstance, MapCreature } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';
import { generateRandomUuid } from '../lib/utils';

interface CreateCreature {
  mapId: string;
  x: number;
  y: number;
  creatureTemplateId: string;
}

export const creatureService = {
  getCreature(creatureId: string) {
    const creature = serverState.creature.get(creatureId);
    if (!creature) {
      throw new HTTPException(400, { message: 'creature not found' });
    }
    return creature;
  },
  getCreatureMapData(creatureId: string): MapCreature {
    const creature = this.getCreature(creatureId);

    return {
      id: creature.id,
      image: creature.image,
      name: creature.name,
      x: creature.x,
      y: creature.y,
    };
  },
  createCreature({ creatureTemplateId, mapId, x, y }: CreateCreature) {
    const { id, ...template } = creatureTemplateById[creatureTemplateId];
    const creatureInstanceId = generateRandomUuid();
    const newCreature: CreatureInstance = {
      id: creatureInstanceId,
      creatureTemplateId,
      mapId,
      x,
      y,
      ...template,
    };
    serverState.creature.set(newCreature.id, newCreature);

    return newCreature;
  },
};
