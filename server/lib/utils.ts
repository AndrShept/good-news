import { BASE_HEALTH_REGEN_TIME, BASE_MANA_REGEN_TIME, BASE_WALK_TIME, HP_MULTIPLIER_COST, MANA_MULTIPLIER_INT } from '@/shared/constants';
import type { IMapJson } from '@/shared/json-types';
import { mapTemplate } from '@/shared/templates/map-template';
import { resourceTemplateById } from '@/shared/templates/resource-template';
import type { ClothType, CraftBuildingType, IngotType, LeatherType, Modifier, OmitModifier, StateType, TileType } from '@/shared/types';
import { render } from '@react-email/components';
import { intervalToDuration } from 'date-fns';
import { sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';
import nodemailer from 'nodemailer';
import z from 'zod';

import { itemTemplateService } from '../services/item-template-service';
import { materialModifierConfig } from './config/material-modifier-config';

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

export const verifyHeroOwnership = ({
  heroUserId,
  userId,
  containerHeroId,
  heroId,
}: {
  heroUserId: string;
  userId: string | undefined;
  containerHeroId?: string | null;
  heroId?: string | null;
}) => {
  if (heroUserId !== userId) {
    throw new HTTPException(403, {
      message: 'access denied',
    });
  }
  if (containerHeroId && containerHeroId !== heroId) {
    throw new HTTPException(403, {
      message: 'access denied',
    });
  }
};

export const getRandomValue = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const rollChance = (chance: number) => {
  return Math.random() * 100 < chance;
};
export const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value));
};

export const getTileExists = (mapId: string, index: number, tileType: TileType) => {
  const map = mapTemplate.find((m) => m.id === mapId);
  const tiles = map?.layers.find((l) => l.name === tileType);
  return tiles?.data[index];
};

export const jobQueueId = {
  offline: (heroId: string) => `offline-${heroId}`,
};

export const sumAllModifier = <T extends Partial<Modifier> | null | undefined>(...args: T[]) => {
  const result: OmitModifier = {
    constitution: 0,
    armor: 0,
    dexterity: 0,
    evasion: 0,
    healthRegen: 0,
    intelligence: 0,
    wisdom: 0,
    luck: 0,
    magicResistance: 0,
    manaRegen: 0,
    maxDamage: 0,
    maxHealth: 0,
    maxMana: 0,
    minDamage: 0,
    physDamage: 0,
    spellDamage: 0,
    strength: 0,
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
    for (const key in item) {
      const typedKey = key as keyof OmitModifier;
      if (typeof item[typedKey] === 'number') {
        result[typedKey] += item[typedKey];
      }
    }
  }
  return result;
};

export const delay = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getModifierByResourceKey = (resourceKey: string, itemTemplateId: string) => {
  const itemTemplate = itemTemplateService.getAllItemsTemplateMapIds()[itemTemplateId];

  switch (itemTemplate.type) {
    case 'ARMOR': {
      switch (itemTemplate.equipInfo!.armorCategory) {
        case 'PLATE':
          return materialModifierConfig.ARMOR.PLATE[resourceKey as IngotType];
        case 'LEATHER':
          return materialModifierConfig.ARMOR.LEATHER[resourceKey as LeatherType];
        case 'MAIL':
          return materialModifierConfig.ARMOR.MAIL[resourceKey as IngotType];
        case 'CLOTH':
          return materialModifierConfig.ARMOR.CLOTH[resourceKey as ClothType];
        default:
          return null;
      }
    }

    case 'WEAPON':
      return materialModifierConfig.WEAPON[resourceKey as IngotType];
    case 'SHIELD':
      return materialModifierConfig.SHIELD[resourceKey as IngotType];
    default:
      return null;
  }
};

export const getDisplayName = (itemTemplateId: string, resourceId: string | undefined) => {
  const itemTemplate = itemTemplateService.getAllItemsTemplateMapIds()[itemTemplateId];
  if (!resourceId) return;
  const resource = resourceTemplateById[resourceId];
  const displayName = `${resource.name.split(' ')[0]} ${itemTemplate.name}`;
  return displayName;
};



export function hash(x: number, y: number, seed: number) {
  let n = x * 374761393 + y * 668265263 + seed * 1446647;
  n = (n ^ (n >> 13)) * 1274126177;
  return Math.abs(n);
}
