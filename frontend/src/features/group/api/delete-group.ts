import { client } from '@/lib/utils';

export const deleteGroup = async (groupId: string) => {
  try {
    const res = await client.group[':id'].delete.$delete({
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
