import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { hc } from 'hono/client';
import toast from 'react-hot-toast';
import { twMerge } from 'tailwind-merge';

import type { ApiRoutes } from '../../../server';

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
export const getTimeFns = (timestamp: number) => {
  const date = new Date(timestamp);
  const hours = date.getUTCHours();
  
  return hours > 0 
    ? format(date, 'HH:mm:ss') 
    : format(date, 'mm:ss');
};

export const toastError = (msg = 'Something went wrong') => {
  toast.error(msg);
};

export const getRarityColor = (data: string) => {
  return {
    'text-primary': data === 'COMMON',
    'text-blue-600': data === 'MAGIC',
    'text-purple-500': data === 'EPIC',
    'text-orange-400': data === 'RARE',
    'text-red-500 ': data === 'LEGENDARY',
  };
};
