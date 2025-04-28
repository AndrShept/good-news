import { client } from '@/lib/utils';
import { ErrorResponse, registerSchema, SuccessResponse } from '@/shared/types';
import { z } from 'zod';

export const signUp = async (data: z.infer<typeof registerSchema>) => {
  try {
    const res = await client.auth.sighup.$post({
      form: data,
    });
    if (res.ok) {
      return (await res.json()) as SuccessResponse;
    }
    return (await res.json()) as unknown as ErrorResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { success: false, message: error.message };
    }
    console.error(error);

    return { success: false, message: 'Something went wrong' };
  }
};