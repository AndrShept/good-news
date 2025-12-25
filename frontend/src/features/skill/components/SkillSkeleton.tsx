import { Skeleton } from '@/components/ui/skeleton';

export const SkillSkeleton = () => {
  const items = Array.from({ length: 10 }, (_, idx) => idx);
  return (
    <>
      {items.map((item) => (
        <div className="flex h-fit w-full flex-col items-center gap-1">
          <div className="flex w-full items-center gap-1">
            <Skeleton key={item} className="h-3 w-1/3" />
            <Skeleton key={item} className="h-3 w-full" />
          </div>

          <Skeleton key={item} className="h-2.5 w-full" />
          <Skeleton key={item} className="h-3 w-1/2" />
        </div>
      ))}
    </>
  );
};
