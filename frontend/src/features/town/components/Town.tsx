import { useHero } from '@/features/hero/hooks/useHero';
import { LocationHeroes } from '@/features/map/components/LocationHeroes';
import { useQuery } from '@tanstack/react-query';

import { getTownOptions } from '../api/get-town';
import { getTownHeroesLocationOptions } from '../api/get-town-heroes';
import { LeaveTownButton } from './LeaveTownButton';
import { TownBuilding } from './TownBuilding';

export const Town = () => {
  const townId = useHero((state) => state?.data?.location?.townId ?? '');
  const town = useQuery(getTownOptions(townId));
  const townLocationHeroes = useQuery(getTownHeroesLocationOptions(townId));

  if (town.isLoading || townLocationHeroes.isLoading) return <div>LOADING MAP</div>;
  return (
    <section className="flex gap-2">
      <div className="w-full max-w-[200px]">
        <LocationHeroes locationHeroes={townLocationHeroes.data} />
      </div>
      <div className="flex flex-1 flex-col gap-2">
        <div className="mx-auto flex items-center gap-2">
          <p className="self-end text-xl">Welcome:</p>
          <h1 className="scroll-m-20 text-balance bg-gradient-to-l from-blue-600 from-0% via-indigo-100 via-50% to-indigo-600 to-100% bg-clip-text text-4xl font-bold tracking-tight text-transparent">
            {town.data?.name}
          </h1>
        </div>
        <LeaveTownButton />
        <ul className="flex gap-1">{town.data?.buildings?.map((building) => <TownBuilding key={building.buildingsId} {...building} />)}</ul>
      </div>
    </section>
  );
};
