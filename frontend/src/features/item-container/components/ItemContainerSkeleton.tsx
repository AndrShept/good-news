import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const ItemContainerSkeleton = () => {
  const items = Array.from({ length: 40 }, (_, idx) => idx);
  return (
    <section className="flex w-full flex-wrap gap-0.5 border-2 border-transparent">
     
        {items.map((item) => (
          <Skeleton key={item} className="size-12 rounded" />
        ))}
    
    </section>
  );
};
