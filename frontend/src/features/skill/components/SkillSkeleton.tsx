import { Skeleton } from '@/components/ui/skeleton';

export const SkillSkeleton = () => {
  const items = Array.from({ length: 4 }, (_, idx) => idx);
  return (
    <ul className="flex flex-col gap-2">
      {items.map((item) => (
        <Skeleton key={item} className="h-22 w-48 rounded-xl" />
      ))}
    </ul>
  );
};
