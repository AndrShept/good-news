import { client } from '@/lib/utils';

export const kickGroupMember = async ({ groupId, memberId }: { groupId: string; memberId: string }) => {
  try {
    const res = await client.group[':id'].member.kick[':memberId'].$delete({
      param: {
        id: groupId,
        memberId,
      },
    });
    const data = await res.json();

    return data;
  } catch (error) {
    console.error(error);
  }
};
