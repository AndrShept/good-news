import { Modifier } from '@/shared/types';
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

const modifierNameSortNumber = {
  strength: { name: 'strength', sortNumber: 1 },
  dexterity: { name: 'dexterity', sortNumber: 2 },
  intelligence: { name: 'intelligence', sortNumber: 3 },
  wisdom: { name: 'wisdom', sortNumber: 4 },
  constitution: { name: 'constitution', sortNumber: 5 },
  luck: { name: 'luck', sortNumber: 6 },

  armor: { name: 'armor', sortNumber: 7 },
  evasion: { name: 'evasion', sortNumber: 8 },
  magicResistance: { name: 'magic resistance', sortNumber: 9 },

  bonusMaxHealth: { name: 'max health', sortNumber: 10 },
  bonusMaxMana: { name: 'max mana', sortNumber: 11 },

  manaRegen: { name: 'mana regen', sortNumber: 14 },
  healthRegen: { name: 'health regen', sortNumber: 15 },

  spellDamage: { name: 'spell damage', sortNumber: 16 },
  spellCritDamage: { name: 'spell crit damage', sortNumber: 17 },
  spellCritRating: { name: 'spell crit rating', sortNumber: 18 },
  spellHitRating: { name: 'spell hit rating', sortNumber: 19 },
  spellPenetration: { name: 'spell penetration', sortNumber: 20 },

  physDamage: { name: 'phys damage', sortNumber: 21 },
  physCritDamage: { name: 'phys crit damage', sortNumber: 22 },
  physCritRating: { name: 'phys crit rating', sortNumber: 23 },
  physHitRating: { name: 'phys hit rating', sortNumber: 24 },
  physPenetration: { name: 'phys penetration', sortNumber: 25 },
} as const satisfies Record<keyof Modifier, { name: string; sortNumber: number }>;

export const getModifierName = (modifier: keyof Modifier) => {
  return modifierNameSortNumber[modifier].name;
};
export const getModifierSortNumber = (modifier: keyof Modifier) => {
  return modifierNameSortNumber[modifier].sortNumber;
};

export const getModifiers = (modifier: Partial<Modifier | undefined>, option?: Partial<Record<keyof Modifier, boolean>>) => {
  const baseModifier: Modifier = {
    spellDamage: 0,
    physDamage: 0,
    strength: 0,
    wisdom: 0,
    dexterity: 0,
    intelligence: 0,
    constitution: 0,
    luck: 0,
    bonusMaxHealth: 0,
    bonusMaxMana: 0,
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

  for (const key in baseModifier) {
    if (!modifier) continue;
    const typedKey = key as keyof Omit<Modifier, 'minDamage' | 'maxDamage'>;
    baseModifier[typedKey] += modifier[typedKey] ?? 0;
  }

  const modifiers = Object.entries(baseModifier).map(([key, value]) => ({
    name: getModifierName(key as keyof Modifier),
    value,
    key,
    sortNumber: getModifierSortNumber(key as keyof Modifier),
  }));
  const options = option
    ? Object.entries(option)
        .filter(([key, value]) => value)
        .map(([key, value]) => key)
    : [];
  const filteredModifiers = modifiers.filter((m) => options.includes(m.key));
  return option ? filteredModifiers : modifiers;
};

export function capitalize(text: string | undefined) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}
