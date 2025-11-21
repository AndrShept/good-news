import { useHero } from '@/features/hero/hooks/useHero';
import { LocationHeroes } from '@/features/map/components/LocationHeroes';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getPlaceOptions } from '../api/get-place';
import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { PlaceSidebar } from './PlaceSidebar';
import { SelectedBuildingPage } from './SelectedBuildingPage';

export const Place = () => {
  const placeId = useHero((state) => state?.data?.location?.placeId ?? '');
  const result = useQueries({ queries: [getPlaceOptions(placeId), getPlaceHeroesLocationOptions(placeId)] });
  const place = result[0].data;
  const townLocationHeroes = result[1].data;
  const isLoading = result.some((r) => r.isLoading);
  const [buildingId, setBuildingId] = useState('');

  if (isLoading) return <p>LOADING TOWN...</p>;
  return (
    <section className="mx-auto flex w-full">
      <PlaceSidebar place={place} setBuildingId={setBuildingId} buildingId={buildingId} />
      <SelectedBuildingPage place={place} buildingId={buildingId} />
      <LocationHeroes locationHeroes={townLocationHeroes} />
    </section>
  );
};
