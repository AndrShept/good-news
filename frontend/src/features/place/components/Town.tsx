import { useHero } from '@/features/hero/hooks/useHero';
import { LocationHeroes } from '@/features/map/components/LocationHeroes';
import { useQueries, useQuery } from '@tanstack/react-query';

import { getPlaceOptions } from '../api/get-place';
import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { LeaveTownButton } from './LeaveTownButton';
import { TownBuilding } from './TownBuilding';

export const Town = () => {
  const placeId = useHero((state) => state?.data?.location?.placeId ?? '');
  const result = useQueries({ queries: [getPlaceOptions(placeId), getPlaceHeroesLocationOptions(placeId)] });
  const place = result[0].data;
  const townLocationHeroes = result[1].data;
  const isLoading = result.some((r) => r.isLoading);

  if (isLoading) return <p>LOADING TOWN...</p>;
  return (
    <section className="flex gap-2">
      <div className="w-full max-w-[200px]">
        <LocationHeroes locationHeroes={townLocationHeroes} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="mx-auto flex items-center gap-2">
          <p className="self-end text-xl">Welcome:</p>
          <h1 className="scroll-m-20 text-balance bg-gradient-to-l from-blue-600 from-0% via-indigo-100 via-50% to-indigo-600 to-100% bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            {place?.name}
          </h1>
        </div>
        <LeaveTownButton />
        <ul className="flex gap-1">{place?.buildings?.map((building) => <TownBuilding key={building.id} {...building} />)}</ul>
      </div>
    </section>
  );
};
