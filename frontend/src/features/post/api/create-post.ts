import { client } from '@/lib/utils';
import { createPostSchema } from '@/shared/types';
import { z } from 'zod';

export const createPost = async (form: z.infer<typeof createPostSchema>) => {
  const res = await client.post.$post({
    form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};
