import { client } from '@/lib/utils';

interface IChangeHeroOnlineStatus {
  heroId: string | undefined;
  status: { isOnline: boolean };
}

export const changeHeroOnlineStatus = async ({ heroId, status }: IChangeHeroOnlineStatus) => {
  try {
    const data = await client.hero[':id'].status.$put({
      param: { id: heroId ?? '' },
      json: status,
    });
    return data;
  } catch (error) {
    console.error(error);
  }
};
