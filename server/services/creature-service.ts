import { creatureTemplateById } from '@/shared/templates/creature-template';
import type { Creature } from '@/shared/types';
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
  createCreature({ creatureTemplateId, mapId, x, y }: CreateCreature) {
    const template = creatureTemplateById[creatureTemplateId];
    const id = generateRandomUuid();
    const newCreature: Creature = {
      id,
      creatureTemplateId,
      mapId,
      x,
      y,
    };
    serverState.creature.set(id, newCreature);

    return newCreature;
  },
};
