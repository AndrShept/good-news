import { ErrorResponse } from '@/shared/types';
import { hc } from 'hono/client';

import { ApiRoutes } from '../../../server/index';
import { z } from 'zod';

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
      return res.json();
    }
  } catch (e) {
    return {
      success: false,
      error: String(e),
      isFormError: false,
    } as ErrorResponse;
  }

};
