import { client } from '@/lib/utils';

export const upvoteComment = async (commentId: string) => {
  // await new Promise((r) => setTimeout(r, 2000));
  // throw new Error('TOTOTO')
  const res = await client.comment[':id'].upvote.$post({
    param: {
      id: commentId,
    },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message);
  }
  return data;
};
