import { BASE_WALK_TIME } from '@/shared/constants';
import type { Map, Tile, TileType } from '@/shared/types';
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
