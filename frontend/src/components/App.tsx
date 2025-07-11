import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useHero } from '@/features/hero/hooks/useHero';
import { router } from '@/main';
import { useQuery, useSuspenseQuery } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { SocketProvider } from './providers/SocketProvider';

export const App = () => {
  // const auth = useAuth();
  // const { data: auth, isLoading } = useQuery(getUserQueryOptions());
  // const user = auth ? { id: auth.id, username: auth.username } : undefined;
  // if (isLoading) return <div className="h-screen bg-red-800"></div>

  return (
    <>
      ({/* <SocketProvider user={user}> */}
      {/* <RouterProvider router={router} context={{ auth }} /> */}
     
      {/* </SocketProvider> */})
    </>
  );
};
