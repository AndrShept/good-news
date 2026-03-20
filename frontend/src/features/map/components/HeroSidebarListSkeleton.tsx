import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export const HeroSidebarListSkeleton = () => {
  const items = Array.from({ length: 8 }, (_, idx) => idx);
  return (
    <ul className="hidden w-full max-w-[200px] select-text flex-col gap-1 p-1.5 sm:flex">
      {items.map((item) => (
        <div className="flex items-center gap-1.5 px-2 py-1" key={item}>
          <Skeleton className="size-8 shrink-0 rounded-full" />
          <div className="flex w-full flex-col gap-1">
            <Skeleton className="size-3.5 w-4/5" />
            <Skeleton className="size-3 w-1/2" />
          </div>
        </div>
      ))}
    </ul>
  );
};
