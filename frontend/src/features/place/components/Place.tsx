import { useHero } from '@/features/hero/hooks/useHero';
import { LocationHeroesList } from '@/features/map/components/LocationHeroesList';
import { useQuery } from '@tanstack/react-query';

import { getPlaceOptions } from '../api/get-place';
import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { PlaceSidebar } from './PlaceSidebar';
import { SelectedBuildingPage } from './SelectedBuildingPage';

export const Place = () => {
  const placeId = useHero((state) => state?.data?.location?.placeId ?? '');
  const placeData = useQuery(getPlaceOptions(placeId));
  const locationHeroesData = useQuery(getPlaceHeroesLocationOptions(placeId));

  if (placeData.isLoading) return <p>LOADING ...</p>;
  return (
    <section className="mx-auto flex w-full">
      <PlaceSidebar place={placeData.data} />
      <SelectedBuildingPage place={placeData.data} />
      <LocationHeroesList isLoading={locationHeroesData.isLoading} locationHeroes={locationHeroesData.data} />
    </section>
  );
};
