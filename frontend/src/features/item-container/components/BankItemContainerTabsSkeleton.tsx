import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const BankItemContainerTabsSkeleton = () => {
  const items = Array.from({ length: 10 }, (_, idx) => idx);
  return (
    <>
      {items.map((item) => (
        <Skeleton key={item} className="h-4 w-6 rounded" />
      ))}
    </>
  );
};
