import { client } from '@/lib/utils';
import { ErrorResponse, createHeroSchema } from '@/shared/types';
import { z } from 'zod';

export const createHero = async ({characterImage, avatarImage, name, modifier, freeStatPoints }: z.infer<typeof createHeroSchema>) => {
  const res = await client.hero.create.$post({
    form: {characterImage, avatarImage, name, modifier: JSON.stringify(modifier), freeStatPoints: freeStatPoints.toString() },
  });
  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;
    return error;
  }

  return res.json();
};
