import { ErrorResponse, SuccessResponse, registerSchema } from '@/shared/types';
import '@/shared/types';
import { queryOptions } from '@tanstack/react-query';
import { redirect } from '@tanstack/react-router';
import toast from 'react-hot-toast';
import { z } from 'zod';

import { client } from './api';

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

export const signIn = async (data: { password: string; email: string }) => {
  try {
    const res = await client.auth.login.$post({
      form: { ...data },
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return (await res.json()) as unknown as ErrorResponse;
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      return { success: false, message: error.stack };
    }
    console.error(error);
    return { success: false, message: 'Something went wrong' };
  }
};
export const LogOut = async () => {
  const res = await client.auth.logout.$get();
  if (res.redirected) {
    window.location.href = res.url;
  }
};
export const getUser = async () => {
  try {
    const res = await client.auth.user.$get();
    if (res.ok) {
      return (await res.json()).data;
    }
    return undefined;
  } catch (error) {
    console.error(error);
  }
};
export const getUserQueryOptions = () =>
  queryOptions({
    queryKey: ['user'],
    queryFn: getUser,
    staleTime: Infinity,
  });
