import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';
import { ApiRoutes } from '../../../server';
import { hc } from 'hono/client';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const client = hc<ApiRoutes>('/', {
  fetch: (input: RequestInfo | URL, init?: RequestInit) =>
    fetch(input, {
      ...init,
      credentials: 'include',
    }),
}).api;



export const getFormatDateTime = (time: string | undefined) => {
  if (!time) return;
  return format(time, 'dd.MM.yyyy HH:mm:ss');
};


