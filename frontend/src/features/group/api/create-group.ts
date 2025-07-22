import { client } from '@/lib/utils';

export const createGroup = async (heroId: string) => {
  try {
    const res = await client.group.create.hero[':id'].$post({
      param: {
        id: heroId,
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
