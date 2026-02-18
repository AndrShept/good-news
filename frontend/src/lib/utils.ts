import { Layer } from '@/shared/json-types';
import { mapTemplate } from '@/shared/templates/map-template';
import { IPosition, OmitModifier, TileType } from '@/shared/types';
import { type ClassValue, clsx } from 'clsx';
import { format, intervalToDuration } from 'date-fns';
import { hc } from 'hono/client';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import type { ApiRoutes } from '../../../server';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const client = hc<ApiRoutes>('/', {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
}).api;

export const getFormatDateTime = (time: string | undefined) => {
  if (!time) return;
  return format(time, 'dd.MM.yyyy HH:mm:ss');
};
export const getTimeFns = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours();

  return hours > 0 ? format(date, 'HH:mm:ss') : format(date, 'mm:ss');
};

export const formatDurationFromSeconds = (seconds: number) => {
  const duration = intervalToDuration({ start: 0, end: seconds });

  const h = duration.hours ?? 0;
  const m = duration.minutes ?? 0;
  const s = duration.seconds ?? 0;

  if (h > 0) {
    return `${h}h ${m}m ${s}s`;
  }

  if (m > 0) {
    return `${m}m ${s}s`;
  }

  return `${s}s`;
};

export const toastError = (msg = 'Something went wrong') => {
  toast.error(msg);
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

interface IGetTileExists {
  index: number;
  tileType: TileType;
  layers: Layer[];
}

export const getTileExists = ({ index, layers, tileType }: IGetTileExists) => {
  const tiles = layers.find((l) => l.name === tileType);
  return tiles?.data[index];
};

export const modifierChangeName = (modifier: keyof OmitModifier) => {
  const variants: Record<keyof OmitModifier, string> = {
    minDamage: 'min damage',
    maxDamage: 'max damage',
    strength: 'strength',
    dexterity: 'dexterity',
    intelligence: 'intelligence',
    constitution: 'constitution',
    luck: 'luck',
    wisdom: 'wisdom',
    defense: 'defense',
    evasion: 'evasion',
    magicResistance: 'magic resistance',
    healthRegen: 'health regen',
    manaRegen: 'mana regen',
    maxHealth: 'max health',
    maxMana: 'max mana',
    physDamage: 'phys damage',
    physCritChance: 'phys crit chance',
    physCritPower: 'phys crit power',
    physHitChance: 'phys hit chance',
    spellDamage: 'spell damage',
    spellCritChance: 'spell crit chance',
    spellCritPower: 'spell crit power',
    spellHitChance: 'spell hit chance',
  };
  return variants[modifier];
};

export const getModifiers = (...args: Partial<OmitModifier | undefined>[]) => {
  const baseModifier: Omit<OmitModifier, 'minDamage' | 'maxDamage'> = {
    spellDamage: 0,
    spellCritPower: 0,
    spellCritChance: 0,
    spellHitChance: 0,
    physDamage: 0,
    physCritPower: 0,
    physCritChance: 0,
    physHitChance: 0,
    strength: 0,
    wisdom: 0,
    dexterity: 0,
    intelligence: 0,
    constitution: 0,
    luck: 0,
    maxHealth: 0,
    maxMana: 0,
    manaRegen: 0,
    healthRegen: 0,
    defense: 0,
    magicResistance: 0,
    evasion: 0,
  };
  for (const item of args) {
    for (const key in baseModifier) {
      if (!item) continue;
      const typedKey = key as keyof Omit<OmitModifier, 'minDamage' | 'maxDamage'>;
      baseModifier[typedKey] += item[typedKey] ?? 0;
    }
  }

  return Object.entries(baseModifier).map(([key, value]) => ({ name: modifierChangeName(key as keyof OmitModifier), value }));
};

export function capitalize(text: string | undefined) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
