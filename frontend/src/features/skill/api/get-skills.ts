import { client } from '@/lib/utils';
import { queryOptions } from '@tanstack/react-query';

export const getSkills = async (heroId: string) => {
  try {
    const res = await client.hero[':id'].skills.$get({
      param: {
        id: heroId,
      },
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message);
    }
    return data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getSkillsOptions = (heroId: string) =>
  queryOptions({
    queryKey: ['skills', heroId],
    staleTime: 60 * 1000,
    queryFn: () => getSkills(heroId),



  });
