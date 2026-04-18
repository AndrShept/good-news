
import type { Corpse, MapCorpse } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';


interface CreateCorpse {
  mapId: string;
  x: number;
  y: number;
  entityId: string;
}

export const corpseService = {
  getCorpse(corpseId: string) {
    const corpse = serverState.corpse.get(corpseId);
    if (!corpse) {
      throw new HTTPException(400, { message: 'corpse not found' });
    }
    return corpse;
  },
  getCorpseMapData(corpseId: string): MapCorpse {
    const corpse = this.getCorpse(corpseId);

    return {
      id: corpse.id,
      image: corpse.image,
      name: corpse.name,
      x: corpse.x,
      y: corpse.y,
    };
  },
  createCorpse(corpse: Corpse) {
    serverState.corpse.set(corpse.id, corpse);

    return corpse;
  },
};
