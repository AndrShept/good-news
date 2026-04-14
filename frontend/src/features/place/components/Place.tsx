import { useHero } from '@/features/hero/hooks/useHero';
import { EntitySidebar } from '@/features/map/components/EntitySidebar';
import { useQuery } from '@tanstack/react-query';

import { getPlaceOptions } from '../api/get-place';
import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { PlaceDataSkeleton } from './PlaceDataSkeleton';
import { PlaceSidebar } from './PlaceSidebar';
import { SelectedPlaceEntitiesPage } from './SelectedPlaceEntitiesPage';

export const Place = () => {
  const placeId = useHero((data) => data?.location?.placeId ?? '');
  const placeData = useQuery(getPlaceOptions(placeId));
  const placeHeroes = useQuery(getPlaceHeroesLocationOptions(placeId));

  return (
    <section className="mx-auto flex w-full">
      {placeData.isLoading ? (
        <PlaceDataSkeleton />
      ) : (
        <>
          <PlaceSidebar entrances={placeData.data?.entrances ?? []} place={placeData.data} />
          <SelectedPlaceEntitiesPage place={placeData.data} />
        </>
      )}

      <EntitySidebar mode="PLACE" isLoading={placeHeroes.isLoading} heroes={placeHeroes.data} corpses={undefined} creatures={undefined} />
    </section>
  );
};
