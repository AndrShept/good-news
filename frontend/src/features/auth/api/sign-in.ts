import { client } from '@/lib/utils';
import { ErrorResponse } from '@/shared/types';

export const signIn = async (data: { password: string; email: string }) => {
  try {
    const res = await client.auth.login.$post({
      form: { ...data },
    });

    if (!res.ok) {
      const data = await res.json() as unknown as ErrorResponse
      return data
    }
    return await res.json()
   
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { success: false, message: error.stack };
    }
    console.error(error);
    return { success: false, message: 'Something went wrong' };
  }
};
