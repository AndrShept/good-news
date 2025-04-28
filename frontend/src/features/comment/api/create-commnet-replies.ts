import { client } from '@/lib/utils';
import { createCommentSchema } from '@/shared/types';
import { z } from 'zod';

export const createCommentReplies = async ({ id, form }: { id: string; form: z.infer<typeof createCommentSchema> }) => {
  const res = await client.comment[':id'].$post({
    param: {
      id,
    },
    form,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};
