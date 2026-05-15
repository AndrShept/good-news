import { LogOut } from '@/features/auth/api/logout';
import { useQueryClient } from '@tanstack/react-query';
import React, { useTransition } from 'react';

import { Button } from './ui/button';

export const LogOutButton = () => {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();
  return (
    <Button
      disabled={isPending}
      variant={'outline'}
      onClick={() => {
        startTransition(async () => {
          await LogOut();
          queryClient.removeQueries();
        });
      }}
    >
      Log out
    </Button>
  );
};
