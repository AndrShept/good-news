import { ErrorResponse, SuccessResponse } from '@/shared/types';
import '@/shared/types';
import { queryOptions } from '@tanstack/react-query';

import { client } from './api';

export const signUp = async (username: string, password: string) => {
  try {
    const res = await client.auth.sighup.$post({
      form: {
        password,
        username,
      },
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

export const signIn = async (data: { password: string; username: string }) => {
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
