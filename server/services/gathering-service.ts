import { TILE_BASE_RESPAWN_TIME, TILE_INITIAL_CHARGES, WORLD_SEED } from '@/shared/constants';
import { type GatheringCategorySkillKey, skillTemplateByKey } from '@/shared/templates/skill-template';
import { toolsTemplate } from '@/shared/templates/tool-template';
import type { FishingTileTpe, ForagingTileTpe, IPosition, LumberTileType, MiningTileType, OmitTileType, TileType } from '@/shared/types';
import { getMapLayerNameAtHeroPos } from '@/shared/utils';
import { HTTPException } from 'hono/http-exception';

import { type TileState, serverState } from '../game/state/server-state';
import { type GatheringItem, MINING_TABLE } from '../lib/config/gathering-tile-table';
import { clamp, getRandomValue, hash } from '../lib/utils';
import { heroService } from './hero-service';
import { itemContainerService } from './item-container-service';
import { skillService } from './skill-service';

interface GetOrCreateGatherTileState {
  gatherSkill: GatheringCategorySkillKey;
  x: number;
  y: number;
  mapId: string | null;
}
interface GetGatherReward {
  heroId: string;
  tileType: OmitTileType;
  gatherSkill: GatheringCategorySkillKey;
  x: number;
  y: number;
}

interface GatheringTilesMap {
  FISHING: FishingTileTpe[];
  FORAGING: ForagingTileTpe[];
  LUMBERJACKING: LumberTileType[];
  MINING: MiningTileType[];
  SKINNING: [];
}
interface GetGatherRewardQuantity {
  luck: number;
  gatherSkillLevel: number;
  loreSkillLevel: number | undefined;
  maxQuantity: number;
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

  getTilesTypeByGatherSkill<K extends GatheringCategorySkillKey>(gatherSkill: K): GatheringTilesMap[K] {
    const tileTypeData: GatheringTilesMap = {
      FISHING: ['DEEP_WATER', 'WATER'],
      FORAGING: ['FOREST', 'MEADOW', 'PLAINS'],
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
    const backpack = itemContainerService.getBackpack(hero.id);
    const tool = toolsTemplate.find((t) => t.toolInfo.skillTemplateId === skillTemplate.id);
    if (!tool) throw new HTTPException(404, { message: 'tool not found' });
    if (!hero.location.mapId) throw new HTTPException(400, { message: 'You must be on a map to start gathering.' });
    const equipTool = hero.equipments.find((e) => e.itemTemplateId === tool.id);
    if (!equipTool) {
      throw new HTTPException(400, {
        message: `You must equip ${tool.name} to start ${skillTemplate.name.toLowerCase()}.`,
        cause: { canShow: true },
      });
    }
    itemContainerService.checkFreeContainerCapacity(backpack.id);
  },
  setInitialCharges(x: number, y: number, seed: number) {
    return TILE_INITIAL_CHARGES + (hash(x, y, seed) % 5); // 3–7 ударів
  },
  setRespawnTileState() {
    return Date.now() + TILE_BASE_RESPAWN_TIME;
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
    let tileType: OmitTileType | null = null;
    for (const tile of tilesAroundHero) {
      const tileState = gatheringService.getOrCreateGatherTileState({ mapId: hero.location.mapId, x: tile.x, y: tile.y, gatherSkill });
      if (tileState && tileState.charges > 0) {
        resultTileState = tileState;
        tileType = tile.tileType;
        break;
      }
    }
    console.log('resultTileState', resultTileState);
    if (!resultTileState) {
      throw new HTTPException(409, { message: 'This vein has been depleted. Try again later.', cause: { canShow: true } });
    }
    if (tileType) {
      hero.selectedGatherTile = { gatherSkillUsed: gatherSkill, x: resultTileState.x, y: resultTileState.y, tileType };
    }
  },
  getGatherReward({ gatherSkill, tileType, x, y, heroId }: GetGatherReward) {
    let table: GatheringItem[] | null = null;
    const skillInstance = skillService.getSkillByKey(heroId, gatherSkill);
    switch (gatherSkill) {
      case 'MINING':
        table = MINING_TABLE[tileType as MiningTileType];
        break;
    }
    if (!table) return;
    const totalChance = table.reduce((sum, o) => sum + o.chance, 0);
    const value = hash(x, y, WORLD_SEED) % totalChance;
    let cumulative = 0;
    for (const tableItem of table) {
      cumulative += tableItem.chance;
      if (value < cumulative) {
        const diff = (skillInstance.level - tableItem.requiredMinSkill) / 100;
        const finishChance = diff < 0 ? diff : diff + 0.25;
        const successChance = clamp(finishChance, 0.01, 0.95);
        if (successChance > Math.random()) {
          console.log('-------PROK-------', tableItem);
          console.log('tableItem', successChance);
          return tableItem;
        }
      }
    }
    {
      const fallback = table[0];
      const diff = (skillInstance.level - fallback.requiredMinSkill) / 100;
      const finishChance = diff < 0 ? diff : diff + 0.25;
      const successChance = clamp(finishChance, 0.05, 0.95);
      console.log('FALLBACK', successChance);
      if (successChance > Math.random()) {
        return fallback;
      }
    }
  },
  getGatherRewardQuantity({ gatherSkillLevel, loreSkillLevel, luck, maxQuantity }: GetGatherRewardQuantity) {
    const chance = gatherSkillLevel * 0.001 + (loreSkillLevel ?? 0) * 0.002 + luck * 0.0005;

    const finalChance = clamp(chance, 0, 0.5);
    if (finalChance > Math.random()) {
      return getRandomValue(2, maxQuantity);
    }
    return 1;
  },
};
