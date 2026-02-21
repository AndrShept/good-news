import { gatheringConfig } from '@/shared/config/gathering-config';
import { WORLD_SEED } from '@/shared/constants';
import { type GatheringCategorySkillKey, skillTemplateByKey } from '@/shared/templates/skill-template';
import { toolsTemplate } from '@/shared/templates/tool-template';
import type { IPosition, OmitTileType, TileType } from '@/shared/types';
import { getMapLayerNameAtHeroPos } from '@/shared/utils';
import { HTTPException } from 'hono/http-exception';

import { type TileState, serverState } from '../game/state/server-state';
import { type GatheringTable, MINING_TABLE } from '../lib/config/resource-config';
import { clamp, hash } from '../lib/utils';
import { heroService } from './hero-service';

interface GetOrCreateGatherTileState {
  gatherSkill: GatheringCategorySkillKey;
  x: number;
  y: number;
  mapId: string | null;
}

export const gatheringService = {
  getGatherTileState(heroId: string, gatherSkill: GatheringCategorySkillKey) {
    const hero = heroService.getHero(heroId);
    const { mapId } = hero.location;
    if (!mapId || !hero.selectedGatherTile) return;
    const { x, y } = hero.selectedGatherTile;
    const tileKey = `${gatherSkill}:${x}:${y}`;
    const tileMap = serverState.worldResourceTiles.get(mapId);
    const tileState = tileMap?.get(tileKey);
    if (!tileState) {
      throw new HTTPException(400, { message: 'tileState not found' });
    }
    return tileState;
  },

  getTilesTypeByGatherSkill(gatherSkill: GatheringCategorySkillKey) {
    const tileTypeData: Record<GatheringCategorySkillKey, OmitTileType[]> = {
      FISHING: ['DEEP_WATER', 'WATER'],
      FORAGING: ['FOREST', 'MEADOW'],
      LUMBERJACKING: ['FOREST', 'DARK_FOREST'],
      MINING: ['CAVE', 'STONE'],
      SKINNING: [],
    };

    return tileTypeData[gatherSkill];
  },

  getOrCreateGatherTileState({ gatherSkill, x, y, mapId }: GetOrCreateGatherTileState) {
    if (!mapId) return;

    const tileKey = `${gatherSkill}:${x}:${y}`;

    let mapTiles = serverState.worldResourceTiles.get(mapId);

    if (!mapTiles) {
      mapTiles = new Map();
      serverState.worldResourceTiles.set(mapId, mapTiles);
    }

    let tileState = mapTiles.get(tileKey);

    if (!tileState) {
      tileState = {
        charges: this.setInitialCharges(x, y, WORLD_SEED),
        respawnAt: this.setRespawnTileState(),
        x,
        y,
      };

      mapTiles.set(tileKey, tileState);
    }

    return tileState;
  },

  canStartGathering(heroId: string, skillKey: GatheringCategorySkillKey) {
    const skillTemplate = skillTemplateByKey[skillKey];
    const hero = heroService.getHero(heroId);
    const tool = toolsTemplate.find((t) => t.toolInfo.skillTemplateId === skillTemplate.id);
    if (!tool) throw new HTTPException(404, { message: 'tool not found' });
    if (!hero.location.mapId) throw new HTTPException(400, { message: 'You must be on a map to start gathering.' });
    const equipTool = hero.equipments.find((e) => e.itemTemplateId === tool.id);
    if (!equipTool)
      throw new HTTPException(400, { message: `You must equip ${tool.name} to start ${skillTemplate.name}.}`, cause: { canShow: true } });
  },
  setInitialCharges(x: number, y: number, seed: number) {
    return 3 + (hash(x, y, seed) % 5); // 3–7 ударів
  },
  setRespawnTileState() {
    return Date.now() + 1000 * 20;
  },
  setGatherTileOnMap(heroId: string, gatherSkill: GatheringCategorySkillKey) {
    const hero = heroService.getHero(heroId);
    const pos = { x: hero.location.x, y: hero.location.y };
    const tilesType = gatheringService.getTilesTypeByGatherSkill(gatherSkill);
    const tilesAroundHero = getMapLayerNameAtHeroPos({
      mapId: hero.location.mapId,
      pos,
      radius: 1,
      tilesType,
    });
    console.log(tilesAroundHero);

    if (!tilesAroundHero.length) {
      throw new HTTPException(409, { message: `nothing to ${gatherSkill.toLowerCase()} this area`, cause: { canShow: true } });
    }

    let resultTileState: undefined | TileState = undefined;
    for (const tile of tilesAroundHero) {
      const tileState = gatheringService.getOrCreateGatherTileState({ mapId: hero.location.mapId, x: tile.x, y: tile.y, gatherSkill });
      if (tileState && tileState.charges > 0) {
        resultTileState = tileState;
        break;
      }

    }
    console.log('resultTileState', resultTileState);
    if (!resultTileState) {
      throw new HTTPException(409, { message: 'This vein has been depleted. Try again later.', cause: { canShow: true } });
    }
    hero.selectedGatherTile = resultTileState;
  },

  //   getTileType(pos: IPosition, gatherSkillKey: GatheringCategorySkillKey) {
  //     const tilesAroundHero = getMapLayerNameAtHeroPos(hero.location.mapId, pos);
  //     let existTile: TileType | null = null;
  //     for (const tile of tilesAroundHero) {
  //       if (gatheringConfig[tile as Exclude<TileType, 'GROUND' | 'OBJECT'>].skillKey === skillKey) {
  //         existTile = tile;
  //       }
  //     }
  //     if (!existTile) {
  //       throw new HTTPException(400, { message: `There is nothing to gather here.` });
  //     }
  //     console.log(tilesAroundHero);
  //   },

  //   getGatheringResourceType(tileType: OmitTileType, x: number, y: number, seed: number) {
  //     let table: GatheringTable[] | null = null;
  //     switch (tileType) {
  //       case 'STONE':
  //       case 'CAVE':
  //         table = MINING_TABLE[tileType];
  //         break;
  //     }
  //     if (!table) return;
  //     const totalChance = table.reduce((sum, o) => sum + o.chance, 0);
  //     const value = hash(x, y, seed) % totalChance;
  //     let cumulative = 0;
  //     for (const ore of table) {
  //       cumulative += ore.chance;
  //       if (value < cumulative) return ore;
  //     }
  //     return table[0];
  //   },
  //    getInitialCharges(x: number, y: number, seed: number) {
  //   return 3 + (hash(x, y, seed) % 5) // 3–7 ударів
  // }

  //   mine(heroId: string) {
  //   const hero = heroService.getHero(heroId);
  //   const { x, y, mapId } = hero.location;

  //   const ore = this.getGatheringResourceType(x, y, WORLD_SEED);
  //   const vein = getOrCreateVeinState(mapId, x, y);

  //   if (vein.charges <= 0) {
  //     if (Date.now() < vein.respawnAt) return 'EMPTY';
  //     vein.charges = this.getInitialCharges(x, y, WORLD_SEED);
  //   }

  //   const diff = hero.mining - ore.requiredMinSkill;

  //   // якщо скіл менший — даємо downgrade до Iron
  //   if (diff < 0) {
  //     const fallback = ORE_TABLE[0]; // IRON
  //     const baseChance = clamp(hero.mining / 100, 0.05, 0.8);

  //     if (Math.random() > baseChance)
  //       return 'FAIL';

  //     vein.charges--;
  //     return fallback.oreType;
  //   }

  //   // нормальний success roll
  //   const successChance = clamp(
  //     0.5 + diff / 100,   // чим більший diff — тим стабільніше
  //     0.1,
  //     0.98
  //   );

  //   if (Math.random() > successChance)
  //     return 'FAIL';

  //   vein.charges--;

  //   if (vein.charges <= 0)
  //     vein.respawnAt = Date.now() + 10 * 60 * 1000;

  //   return ore.oreType;
  // }
};
