import {
  boneValues,
  clothValues,
  curedFurValues,
  fiberValues,
  furValues,
  hideValues,
  ingotValues,
  leatherValues,
  logValues,
  oreValues,
  plankValues,
} from '../server/db/schema';
import { itemTemplateService } from '../server/services/item-template-service';
import type { Layer } from './json-types';
import { mapTemplate } from './templates/map-template';
import type { GatheringCategorySkillKey } from './templates/skill-template';
import {
  type CoreResourceType,
  type CraftBuildingKey,
  type GatheringTileType,
  type IPosition,
  type ItemInstance,
  type ItemTemplateType,
  type Modifier,
  type RefiningBuildingKey,
  type RefiningRecipe,
  type SelectedAttackingZone,
  type SelectedDefenseZone,
  type StateType,
  battleShieldZoneValues,
  battleZoneValues,
  gatheringTileTypeValues,
} from './types';

function isBlocked(x: number, y: number, layers: Layer[], width: number): boolean {
  return layers.some((layer) => {
    const index = y * width + x;

    if (layer.name === 'COLLISION') {
      return layer.data?.[index] !== 0;
    }

    if (layer.name === 'GROUND') {
      return layer.data?.[index] === 0;
    }

    return false;
  });
}
const directions = [
  { dx: 1, dy: 0 },
  { dx: -1, dy: 0 },
  { dx: 0, dy: 1 },
  { dx: 0, dy: -1 },

  // діагоналі
  { dx: 1, dy: 1 },
  { dx: 1, dy: -1 },
  { dx: -1, dy: 1 },
  { dx: -1, dy: -1 },
];
function heuristic(a: IPosition, b: IPosition) {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  return Math.max(dx, dy);
}
export function buildPathWithObstacles(from: IPosition, to: IPosition, layers: Layer[], width: number, height: number): IPosition[] {
  const open = new Set<string>();
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();

  const key = (p: IPosition) => `${p.x},${p.y}`;

  open.add(key(from));
  gScore.set(key(from), 0);

  while (open.size > 0) {
    let currentKey: string | null = null;
    let bestScore = Infinity;

    for (const k of open) {
      const [x, y] = k.split(',').map(Number);
      const score = (gScore.get(k) ?? Infinity) + heuristic({ x, y }, to);

      if (score < bestScore) {
        bestScore = score;
        currentKey = k;
      }
    }

    if (!currentKey) break;

    const [cx, cy] = currentKey.split(',').map(Number);

    if (cx === to.x && cy === to.y) {
      const path: IPosition[] = [];
      let k: string | undefined = currentKey;

      while (k && k !== key(from)) {
        const [x, y] = k.split(',').map(Number);
        path.unshift({ x, y });
        k = cameFrom.get(k);
      }

      return path;
    }

    open.delete(currentKey);

    for (const { dx, dy } of directions) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      if (isBlocked(nx, ny, layers, width)) continue;

      const neighborKey = `${nx},${ny}`;
      const cost = dx !== 0 && dy !== 0 ? 1.4 : 1;
      const tentativeG = (gScore.get(currentKey) ?? Infinity) + cost;

      if (tentativeG < (gScore.get(neighborKey) ?? Infinity)) {
        cameFrom.set(neighborKey, currentKey);
        gScore.set(neighborKey, tentativeG);
        open.add(neighborKey);
      }
    }
  }

  return [];
}

export const getHeroStateWithGatherSkillKey = (skillKey: GatheringCategorySkillKey) => {
  const state: Record<GatheringCategorySkillKey, StateType> = {
    FISHING: 'FISHING',
    FORAGING: 'FORAGING',
    WOODCUTTING: 'WOODCUTTING',
    MINING: 'MINING',
    SKINNING: 'SKINNING',
  };
  return state[skillKey];
};

export const getStateWithCraftBuildingType = (craftBuildingKey: CraftBuildingKey) => {
  const stateData: Record<CraftBuildingKey, StateType> = {
    BLACKSMITH: 'BLACKSMITHING',
    ALCHEMY: 'ALCHEMY',
    TAILOR: 'TAILORING',
    CARPENTER: 'CARPENTRY',
  };

  return stateData[craftBuildingKey];
};
export const getStateWithRefiningBuildingKey = (refineBuildingKey: RefiningBuildingKey) => {
  const stateData: Record<RefiningBuildingKey, StateType> = {
    FORGE: 'SMELTING',
    LOOM: 'WEAVING',
    SAWMILL: 'SAWMILLING',
    TANNERY: 'TANNING',
  };

  return stateData[refineBuildingKey];
};

export const getTilesAroundHero = (pos: IPosition, radius = 1) => {
  const tiles: IPosition[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      // if (dx === 0 && dy === 0) continue;
      tiles.push({ x: pos.x + dx, y: pos.y + dy });
    }
  }
  return tiles;
};
interface GetMapLayerNameAtHeroPos {
  mapId: string | null;
  pos: IPosition;
  radius: number;
  tilesType: GatheringTileType[];
}

export const getMapLayerNameAtHeroPos = ({ mapId, pos, radius, tilesType }: GetMapLayerNameAtHeroPos) => {
  const map = mapTemplate.find((m) => m.id === mapId);
  if (!map) return [];

  const around = getTilesAroundHero(pos, radius);
  const result = [];
  const gatheringLayers = map.layers.filter((l) => gatheringTileTypeValues.includes(l.name as GatheringTileType));
  for (const layer of gatheringLayers) {
    for (const p of around) {
      const i = p.y * map.width + p.x;
      if (layer.data?.[i] && tilesType.includes(layer.name as GatheringTileType)) {
        result.push({
          tileType: layer.name as GatheringTileType,
          x: p.x,
          y: p.y,
        });
      }
    }
  }
  return result;
};

export const refineItems: Record<RefiningBuildingKey, Record<Extract<ItemTemplateType, 'RESOURCES' | 'ARMOR' | 'WEAPON'>, string[]>> = {
  FORGE: {
    RESOURCES: [...oreValues],
    WEAPON: [...ingotValues],
    ARMOR: [...ingotValues],
  },
  LOOM: {
    RESOURCES: [...fiberValues],
    ARMOR: [...clothValues],
    WEAPON: [],
  },
  SAWMILL: { RESOURCES: [...logValues], WEAPON: [...plankValues], ARMOR: [] },
  TANNERY: { RESOURCES: [...furValues, ...hideValues], ARMOR: [...curedFurValues, ...leatherValues, ...boneValues], WEAPON: [] },
};

type ItemRefineableForBuilding = {
  coreResource: CoreResourceType | null;
  itemTemplateId: string;
  refiningBuildingKey: RefiningBuildingKey;
};

export const itemRefineableForBuilding = ({ coreResource, itemTemplateId, refiningBuildingKey }: ItemRefineableForBuilding) => {
  const itemTemplate = itemTemplateService.getTemplateByItemTemplateId(itemTemplateId);

  if (itemTemplate.type === 'RESOURCES') {
    return { isCanRefine: refineItems[refiningBuildingKey].RESOURCES.includes(itemTemplate.key), itemTemplate };
  }

  if (itemTemplate.type === 'WEAPON' && coreResource) {
    return { isCanRefine: refineItems[refiningBuildingKey].WEAPON.includes(coreResource), itemTemplate };
  }

  if (itemTemplate.type === 'ARMOR' && coreResource) {
    return { isCanRefine: refineItems[refiningBuildingKey].ARMOR.includes(coreResource), itemTemplate };
  }

  return { isCanRefine: false };
};

export const getAttackingRandomZone = ({
  isEquipLeftHandWeapon,
  isEquipRightHandWeapon,
}: {
  isEquipRightHandWeapon: boolean;
  isEquipLeftHandWeapon: boolean;
}): SelectedAttackingZone => {
  const randomLeft = Math.floor(Math.random() * battleZoneValues.length);
  const randomRight = Math.floor(Math.random() * battleZoneValues.length);
  return {
    LEFT_HAND: isEquipLeftHandWeapon ? battleZoneValues[randomLeft] : null,
    RIGHT_HAND: isEquipRightHandWeapon ? battleZoneValues[randomRight] : null,
  };
};
export const getDefenseRandomZone = (isEquipShield: boolean): SelectedDefenseZone => {
  const randomIndex = Math.floor(Math.random() * battleZoneValues.length);
  const zone = isEquipShield ? battleShieldZoneValues[randomIndex] : battleZoneValues[randomIndex];
  return zone as SelectedDefenseZone;
};

export const initModifier = (updateModifier?: Partial<Modifier>) => {
  const modifier: Modifier = {
    strength: 0,
    dexterity: 0,
    intelligence: 0,
    wisdom: 0,
    constitution: 0,
    luck: 0,
    maxHealth: 0,
    maxMana: 0,
    maxDamage: 0,
    minDamage: 0,
    manaRegen: 0,
    healthRegen: 0,
    armor: 0,
    magicResistance: 0,
    evasion: 0,
    spellDamage: 0,
    spellCritDamage: 0,
    spellCritRating: 0,
    spellHitRating: 0,
    spellPenetration: 0,
    physDamage: 0,
    physCritDamage: 0,
    physCritRating: 0,
    physHitRating: 0,
    physPenetration: 0,
  };
  return { ...modifier, ...updateModifier };
};
