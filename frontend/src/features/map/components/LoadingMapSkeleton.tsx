import { Skeleton } from '@/components/ui/skeleton';

export const LoadingMapSkeleton = () => {
  return (
    <section className="relative mx-auto aspect-video w-full max-w-[700px]">
      <Skeleton className="size-full" />
    </section>
  );
};
