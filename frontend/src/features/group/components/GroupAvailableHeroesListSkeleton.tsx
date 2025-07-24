import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const GroupAvailableHeroesListSkeleton = () => {
  const arr = Array.from({ length: 3 });
  return (
    <ul className="flex flex-col gap-2">
      {arr.map((_, idx) => (
        <article key={idx} className="flex items-center gap-1 p-2">
          <div className="size-12 shrink-0 rounded-full">
            <Skeleton className="size-full rounded-full" />
          </div>
          <div className="flex w-full flex-col gap-1">
            <Skeleton className="h-4 w-[90%] rounded-xl" />
            <Skeleton className="h-3 w-1/2 rounded-xl" />
          </div>
        </article>
      ))}
    </ul>
  );
};
