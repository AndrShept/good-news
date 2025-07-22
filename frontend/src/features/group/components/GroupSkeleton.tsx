import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const GroupSkeleton = () => {
  const items = Array.from({ length: 3 });
  return (
    <div className="mx-auto flex gap-2">
      {items.map((_, idx) => (
        <Skeleton key={idx} className="size-12 rounded-full" />
      ))}
    </div>
  );
};
