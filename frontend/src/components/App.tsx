import { useAuth } from '@/features/auth/hooks/useAuth';
import { router, socket } from '@/main';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';

export const App = () => {
  const auth = useAuth();
  return <RouterProvider router={router} context={{ auth }} />;
};
