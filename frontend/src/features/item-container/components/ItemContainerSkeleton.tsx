import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const ItemContainerSkeleton = () => {
  const items = Array.from({ length: 30 }, (_, idx) => idx);
  return (
    <>
      {items.map((item) => (
        <Skeleton key={item} className="size-12 rounded" />
      ))}
    </>
  );
};
