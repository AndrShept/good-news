
import {  OmitModifier } from '@/shared/types';
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
    armor: 'armor',
    evasion: 'evasion',
    magicResistance: 'magic resistance',
    healthRegen: 'health regen',
    manaRegen: 'mana regen',
    maxHealth: 'max health',
    maxMana: 'max mana',
    physDamage: 'phys damage',
    physCritRating: 'phys crit rating',
    physCritDamage: 'phys crit damage',
    physHitRating: 'phys hit rating',
    spellDamage: 'spell damage',
    spellCritRating: 'spell crit rating',
    spellCritDamage: 'spell crit power',
    spellHitRating: 'spell hit rating',
    spellPenetration: 'spell penetration',
    physPenetration: 'phys penetration',
  };
  return variants[modifier];
};

export const getModifiers = (...args: Partial<OmitModifier | undefined>[]) => {
  const baseModifier: Omit<OmitModifier, 'minDamage' | 'maxDamage'> = {
    spellDamage: 0,
    physDamage: 0,
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
    armor: 0,
    magicResistance: 0,
    evasion: 0,
    spellCritDamage: 0,
    spellCritRating: 0,
    spellHitRating: 0,
    spellPenetration: 0,
    physCritDamage: 0,
    physCritRating: 0,
    physHitRating: 0,
    physPenetration: 0,
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
