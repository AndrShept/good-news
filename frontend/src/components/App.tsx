import { useAuth } from '@/features/auth/hooks/useAuth';
import { router } from '@/main';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';

import { SocketProvider } from './providers/SocketProvider';

export const App = () => {
  const auth = useAuth();
  const user = auth ? { id: auth.id, username: auth.username } : undefined;

  
  return (
    <SocketProvider user={user}>
      <RouterProvider router={router} context={{ auth }} />
    </SocketProvider>
  );
};
