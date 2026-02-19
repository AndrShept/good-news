import type { Layer } from './json-types';
import { mapTemplate } from './templates/map-template';
import type { GatheringCategorySkillKey } from './templates/skill-template';
import type { IHeroStat, IPosition, StateType, TileType } from './types';

function isBlocked(x: number, y: number, layers: Layer[]): boolean {
  return layers.some((layer) => {
    const index = y * layer.width + x;

    if (layer.name === 'WATER' || layer.name === 'OBJECT') {
      return layer.data[index] !== 0;
    }

    if (layer.name === 'GROUND') {
      return layer.data[index] === 0;
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
      if (isBlocked(nx, ny, layers)) continue;

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
    HERBALISM: 'HERBALISM',
    LUMBERJACKING: 'LUMBERJACKING',
    MINING: 'MINING',
    SKINNING: 'SKINNING',
  };
  return state[skillKey];
};



export const getTilesAroundHero = (pos: IPosition, radius = 1) => {
  const tiles: IPosition[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dy = -radius; dy <= radius; dy++) {
      if (dx === 0 && dy === 0) continue;
      tiles.push({ x: pos.x + dx, y: pos.y + dy });
    }
  }
  return tiles;
};
export const getMapLayerNameAtHeroPos = (mapId: string | undefined, pos: IPosition, radius: number = 1): TileType[] => {
  const map = mapTemplate.find((m) => m.id === mapId);
  if (!map) return [];

  const index = pos.y * map.width + pos.x;

  const result = new Set<TileType>();

  for (const layer of map.layers) {
    if (layer.name === 'GROUND' || layer.name === 'DECOR') continue;

    if (layer.data[index]) {
      result.add(layer.name as TileType);
    }
  }

  const around = getTilesAroundHero(pos, radius);

  for (const layer of map.layers) {
    if (!around.length || layer.name !== 'WATER') continue;

    for (const p of around) {
      const i = p.y * map.width + p.x;
      if (layer.data[i]) {
        result.add(layer.name as TileType);
      }
    }
  }

  return [...result];
};

