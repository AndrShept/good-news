import { client } from '@/lib/utils';

export const LogOut = async () => {
  const res = await client.auth.logout.$get();
  if (res.redirected) {
    window.location.href = res.url;
  }
};