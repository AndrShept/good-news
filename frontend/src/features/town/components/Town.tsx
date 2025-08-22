import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';

import { getTownOptions } from '../api/get-map';
import { TownBuilding } from './TownBuilding';

export const Town = () => {
  const townId = useHero((state) => state?.data?.location?.townId ?? '');
  const { data: town, isError, error, isLoading } = useQuery(getTownOptions(townId));

  if (isLoading) return <div>LOADING MAP</div>;
  if (isError) return <p>{error.message}</p>;
  return (
    <section className="flex flex-col">
      <div className="mx-auto flex items-center gap-2">
        <p className="self-end text-xl">Welcome:</p>
        <h1 className="scroll-m-20 text-balance bg-gradient-to-l from-blue-600 from-0% via-indigo-100 via-50% to-indigo-600 to-100% bg-clip-text text-4xl font-bold tracking-tight text-transparent">
          {town?.name}
        </h1>
      </div>
      <ul className="flex gap-1">{town?.buildings?.map((building) => <TownBuilding key={building.buildingsId} {...building} />)}</ul>
    </section>
  );
};
