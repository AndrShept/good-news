import { client } from '@/lib/utils';
import toast from 'react-hot-toast';

export const createAccount = async (token: string) => {
  try {
    const res = await client.auth.confirm.$post({
      query: { token },
    });
    if (res.ok) {
      return await res.json();
    }
    toast.error('Something went wrong');
  } catch (error) {
    console.error(error);
    toast.error('Something went wrong');
    return { success: false, message: 'Something went wrong' };
  }
};
