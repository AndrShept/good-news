import { Layer } from '@/shared/json-types';
import { socketEvents } from '@/shared/socket-events';
import { IPosition, OmitModifier, TileType } from '@/shared/types';
import { IGameMessage } from '@/store/useGameMessages';
import { type ClassValue, clsx } from 'clsx';
import { format, intervalToDuration } from 'date-fns';
import { hc } from 'hono/client';
import { RefObject } from 'react';
import toast from 'react-hot-toast';
import { Socket } from 'socket.io-client';
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

type TJoinRoomParams = {
  socket: Socket;
  id: string;
  joinMessage?: string;
  leaveMessage?: string;
  prevRefId: RefObject<string | null>;
  setGameMessage: (message: IGameMessage) => void;
};

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
  const duration = intervalToDuration({ start: 0, end: seconds * 1000 });

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

export const getRarityColor = (data: string) => {
  return {
    'text-primary': data === 'COMMON',
    'text-blue-600': data === 'MAGIC',
    'text-purple-500': data === 'EPIC',
    'text-orange-400': data === 'RARE',
    'text-red-500 ': data === 'LEGENDARY',
  };
};

export const joinRoomClient = ({ socket, id, joinMessage, leaveMessage, prevRefId, setGameMessage }: TJoinRoomParams) => {
  if (id) {
    socket.emit(socketEvents.joinRoom(), id, (cb: { accept: boolean }) => {
      if (cb.accept && joinMessage) {
        setGameMessage({
          text: `${joinMessage} ${id}`,
          type: 'info',
        });
      }
    });
    prevRefId.current = id;
  }
  if (prevRefId.current && !id) {
    socket.emit(socketEvents.leaveRoom(), prevRefId.current, (cb: { accept: boolean }) => {
      if (cb.accept && leaveMessage) {
        setGameMessage({
          text: `${leaveMessage} ${prevRefId.current}`,
          type: 'error',
        });
      }
    });
  }
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

interface IGetTileExists {
  index: number;
  tileType: TileType;
  layers: Layer[];
}

export const getTileExists = ({ index, layers, tileType }: IGetTileExists) => {
  const tiles = layers.find((l) => l.name === tileType);
  return tiles?.data[index];
};

export const rarityConfig = {
  COMMON: {
    color: '',
    border: '',
    glow: '',
    bg: '',
  },
  MAGIC: {
    color: 'text-rarity-magic',
    border: 'border-rarity-magic/50 ',
    glow: 'shadow-[0_0_20px_rgba(96,165,250,0.4)]',
    bg: 'bg-rarity-magic/10',
  },
  RARE: {
    color: 'text-rarity-rare',
    border: 'border-rarity-rare/50',
    glow: 'shadow-[0_0_20px_rgba(139,92,246,0.4)]',
    bg: 'bg-rarity-rare/10',
  },
  EPIC: {
    color: 'text-rarity-epic',
    border: 'border-rarity-epic/50',
    glow: 'shadow-[0_0_25px_rgba(168,85,247,0.5)]',
    bg: 'bg-rarity-epic/10',
  },
  LEGENDARY: {
    color: 'text-rarity-legendary',
    border: 'border-rarity-legendary/60 border-1',
    glow: 'shadow-[0_0_30px_rgba(251,191,36,0.6)]',
    bg: 'bg-rarity-legendary/10',
  },
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
      restoreHealth: 'health',
      restoreMana: 'mana',
    };
    return variants[modifier];
  };