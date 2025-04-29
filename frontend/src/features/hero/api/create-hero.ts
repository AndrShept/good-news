import { client } from '@/lib/utils';
import { ErrorResponse, createHeroSchema } from '@/shared/types';
import { z } from 'zod';

export const createHero = async ({ image, name }: z.infer<typeof createHeroSchema>) => {
  const res = await client.hero.create.$post({
    form: { image, name },
  });
  if (!res.ok) {
    const error = (await res.json()) as ErrorResponse;
    return error;
  }

  return res.json();
};
