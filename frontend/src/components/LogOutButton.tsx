import { LogOut } from '@/features/auth/api/logout';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

import { Button } from './ui/button';

export const LogOutButton = () => {
  const queryClient = useQueryClient();
  return (
    <Button
      variant={'ghost'}
      onClick={async () => {
        await LogOut();
        queryClient.removeQueries();
      }}
    >
      Log out
    </Button>
  );
};
