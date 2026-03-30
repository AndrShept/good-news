import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const ItemContainerSkeleton = ({ itemValue = 40 }: { itemValue?: number }) => {
  const items = Array.from({ length: itemValue }, (_, idx) => idx);
  return (
    <ul className="flex h-fit w-full flex-wrap gap-0.5 border-2 border-transparent">
      {items.map((item) => (
        <Skeleton key={item} className="size-12 rounded" />
      ))}
    </ul>
  );
};
