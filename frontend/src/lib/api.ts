import { ErrorResponse, SuccessResponse } from '@/shared/types';
import { hc } from 'hono/client';
import { HTTPResponseError } from 'hono/types';
import { z } from 'zod';

import { ApiRoutes } from '../../../server/index';

const client = hc<ApiRoutes>('/', {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
}).api;

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
