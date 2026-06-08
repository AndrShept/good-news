import { imageConfig } from '@/shared/config/image-config';
import type { Corpse, CreatureInstance, MapCorpse } from '@/shared/types';
import { HTTPException } from 'hono/http-exception';

import { type HeroRuntime, serverState } from '../game/state/server-state';
import { generateRandomUuid } from '../lib/utils';
import { mapService } from './map-service';
import { socketService } from './socket-service';

interface CreateCreatureCorpseParam {
  creature: CreatureInstance;
  chunkId: string;
  now: number;
}

interface CreateHeroCorpseParam {
  hero: HeroRuntime;
  chunkId: string;
  now: number;
}

export const corpseService = {
  getCorpse(corpseId: string) {
    const corpse = serverState.corpse.get(corpseId);
    if (!corpse) {
      throw new HTTPException(400, { message: 'corpse not found' });
    }
    return corpse;
  },
  createCreatureCorpse({ chunkId, creature, now }: CreateCreatureCorpseParam) {
    const newCorpse = this.createCorpse({
      id: generateRandomUuid(),
      parentEntityId: creature.id,
      expiredAt: now + 60_000 * 20, //20 min
      name: `${creature.name} corpse`,
      image: imageConfig.icon.ui.grave,
      mapId: creature.mapId,
      type: 'CREATURE',
      x: creature.x,
      y: creature.y,
    });
    mapService.despawnMapEntitiesInChunk({
      entityId: creature.id,
      type: 'CREATURE',
      mapId: creature.mapId,
      x: creature.x,
      y: creature.y,
    });
    mapService.spawnMapEntitiesInChunk({
      entityId: newCorpse.id,
      type: 'CORPSE',
      mapId: newCorpse.mapId,
      x: newCorpse.x,
      y: newCorpse.y,
    });
    socketService.sendMapChunkSpawnEntities({
      type: 'CORPSE',
      chunkId,
      entityIds: [newCorpse.id],
    });
  },
  createHeroCorpse({ chunkId, hero, now }: CreateHeroCorpseParam) {
    const newCorpse = this.createCorpse({
      id: generateRandomUuid(),
      parentEntityId: hero.id,
      expiredAt: now + 60_000 * 30, //20 min
      name: `${hero.name} corpse`,
      image: imageConfig.icon.ui.grave,
      mapId: hero.location.mapId!,
      type: 'HERO',
      x: hero.location.x,
      y: hero.location.y,
    });

    mapService.spawnMapEntitiesInChunk({
      entityId: newCorpse.id,
      type: 'CORPSE',
      mapId: newCorpse.mapId,
      x: newCorpse.x,
      y: newCorpse.y,
    });
    socketService.sendMapChunkSpawnEntities({
      type: 'CORPSE',
      chunkId,
      entityIds: [newCorpse.id],
    });
  },
  getCorpseMapData(corpseId: string): MapCorpse {
    const corpse = this.getCorpse(corpseId);

    return {
      id: corpse.id,
      image: corpse.image,
      name: corpse.name,
      expiredAt: corpse.expiredAt,
      x: corpse.x,
      y: corpse.y,
    };
  },
  createCorpse(corpse: Corpse) {
    serverState.corpse.set(corpse.id, corpse);

    return corpse;
  },
};
