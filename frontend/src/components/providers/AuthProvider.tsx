import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { useQuery } from '@tanstack/react-query';
import React, { ReactNode } from 'react';

import { Spinner } from '../Spinner';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading } = useQuery(getUserQueryOptions());
  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Spinner />
      </div>
    );
  }

  return <>{children}</>;
};
