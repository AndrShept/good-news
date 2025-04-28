import { client } from '@/lib/utils';


export const upvotePost = async (postId: string) => {
    // await new Promise((r) => setTimeout(r, 2000));
    const res = await client.post[':id'].upvote.$post({
      param: {
        id: postId,
      },
    });
    if (res.ok) {
      return await res.json();
    }
    const data = await res.json();
    throw new Error(data.message);
  };