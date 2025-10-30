import { client } from '@/lib/utils';
import { keepPreviousData, queryOptions } from '@tanstack/react-query';

export const getGroupMembers = async ({ groupId }: { groupId: string }) => {
  try {
    const res = await client.group[':id'].heroes.$get({
      param: {
        id: groupId,
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getGroupMembersOptions = (groupId: string) =>
  queryOptions({
    queryKey: ['group', groupId],
    enabled: Boolean(groupId),
    queryFn: () => getGroupMembers({ groupId }),
    staleTime: 0,
    select: (data) => data?.data,
  });
