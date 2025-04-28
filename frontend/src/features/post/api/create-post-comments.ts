import { client } from '@/lib/utils';
import { createCommentSchema } from '@/shared/types';
import { z } from 'zod';

export const createPostComment = async ({ id, form }: { id: string; form: z.infer<typeof createCommentSchema> }) => {
  const res = await client.post[':id'].comment.$post({
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