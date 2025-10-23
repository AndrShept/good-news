import { BASE_WALK_TIME } from '@/shared/constants';
import type { Map, Modifier, OmitModifier, Tile, TileType } from '@/shared/types';
import { render } from '@react-email/components';
import { intervalToDuration } from 'date-fns';
import { sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import nodemailer from 'nodemailer';
import z from 'zod';

import { getMapJson } from './buildingMapData';

const schema = z.object({
  DATABASE_URL: z.string(),
  BREVO_USERNAME: z.string(),
  BREVO_PASS: z.string(),
  PORT: z.string(),
  JWT_SECRET: z.string(),
  BASE_URL_FRONT: z.string(),
  UPSTASH_REDIS_REST: z.string(),
  UPSTASH_REDIS_REST_TOKEN: z.string(),
});
export const processEnv = schema.parse(process.env);

interface ISendEmail {
  to: string;
  subject: string;
  text?: string;
  reactElement: any;
}

export const sendEmail = async ({ to, subject, text = '', reactElement }: ISendEmail) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587, // або 465 для SSL
    secure: false, // true якщо порт 465
    auth: {
      user: processEnv.BREVO_USERNAME,
      pass: processEnv.BREVO_PASS,
    },
  });

  const emailHtml = await render(reactElement);

  await transporter.sendMail({
    from: '"Good News" <no-reply@good-news.space>',
    to,
    subject,
    text,
    html: emailHtml,
  });
};

export const generateRandomUuid = () => Bun.randomUUIDv7();

export const setSqlNow = () => sql`NOW()`;
export const setSqlNowByInterval = (seconds: number) => sql`NOW() + INTERVAL ${sql.raw(`'${seconds} seconds'`)}`;

export const verifyHeroOwnership = ({ heroUserId, userId }: { heroUserId: string; userId: string | undefined }) => {
  if (heroUserId !== userId) {
    throw new HTTPException(403, {
      message: 'access denied',
    });
  }
};

export const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const rand = (num: number) => {
  return Math.floor(Math.random() * num);
};

export const calculateWalkTime = (dexterity: number) => {
  const MIN_WALK_TIME = 2;
  const dexterityFactor = 100;

  const delay = Math.max(BASE_WALK_TIME / (1 + dexterity / dexterityFactor), MIN_WALK_TIME);
  return delay;
};

export const getTileExists = (mapId: string, index: number, tileType: TileType) => {
  const map = getMapJson(mapId);
  const tiles = map.jsonUrl.layers.find((l) => l.name === tileType);
  return tiles?.data[index];
};

export const jobQueueId = {
  offline: (heroId: string) => `offline-${heroId}`,
};

export const combineModifiers = <T extends Partial<OmitModifier>>(base: OmitModifier, mode: 'add' | 'subtract', ...args: T[]): Modifier => {
  const newModifier = { ...base } as Modifier;

  for (const item of args) {
    for (const key in item) {
      const typedKey = key as keyof OmitModifier;
      const value = item[typedKey];
      if (typeof value === 'number') {
        newModifier[typedKey] = mode === 'add' ? (newModifier[typedKey] ?? 0) + value : (newModifier[typedKey] ?? 0) - value;
      }
    }
  }

  return newModifier;
};

export const newCombineModifier = <T extends Partial<Modifier> | null>(...args: T[]) => {
  const result: OmitModifier = {
    constitution: 0,
    defense: 0,
    dexterity: 0,
    evasion: 0,
    healthRegen: 0,
    intelligence: 0,
    luck: 0,
    magicResistance: 0,
    manaRegen: 0,
    maxDamage: 0,
    maxHealth: 0,
    maxMana: 0,
    minDamage: 0,
    physCritChance: 0,
    physCritPower: 0,
    physDamage: 0,
    physHitChance: 0,
    spellCritChance: 0,
    spellCritPower: 0,
    spellDamage: 0,
    spellHitChance: 0,
    strength: 0,
  };

  for (const item of args) {
    for (const key in item) {
      const typedKey = key as keyof OmitModifier;
      if (typeof item[typedKey] === 'number') {
        result[typedKey] += item[typedKey];
      }
    }
  }
  return result;
};
