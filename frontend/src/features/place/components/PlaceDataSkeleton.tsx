import { Spinner } from '@/components/Spinner';
import { Skeleton } from '@/components/ui/skeleton';

export const PlaceDataSkeleton = () => {
  const data = Array.from({ length: 8 });
  return (
    <>
      <aside className="top-18 sticky h-[calc(100vh-330px)] max-w-[200px] rounded p-1.5">
        <ul className="flex flex-col gap-1">
          {data.map((_, idx) => (
            <Skeleton key={idx} className="md:w-34 h-12 w-12 rounded-md md:h-8" />
          ))}
        </ul>
      </aside>
      <section className="flex flex-1 items-center justify-center p-1.5">
        <Spinner size={'sm'} />
      </section>
    </>
  );
};
