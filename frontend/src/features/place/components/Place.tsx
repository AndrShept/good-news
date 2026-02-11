import { useHero } from '@/features/hero/hooks/useHero';
import { HeroSidebarList } from '@/features/map/components/HeroSidebarList';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import { getPlaceOptions } from '../api/get-place';
import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { PlaceSidebar } from './PlaceSidebar';
import { SelectedBuildingPage } from './SelectedBuildingPage';
import { Entrance } from '@/shared/types';

export const Place = () => {
  const placeId = useHero((data) => data?.location?.placeId ?? '');
  const placeData = useQuery(getPlaceOptions(placeId));
  const placeHeroes = useQuery(getPlaceHeroesLocationOptions(placeId));
  const selectedBuilding = useSelectBuildingStore();
  const [entrances, setEntrances] = useState<Entrance[] | null>(null);
  if (placeData.isLoading) return <p>LOADING ...</p>;
  return (
    <section className="mx-auto flex w-full">
      <PlaceSidebar entrances={entrances} setEntrances={setEntrances} place={placeData.data} />
      {!!entrances?.length && <div>ENTANCE</div>}
      <SelectedBuildingPage entrances={entrances} place={placeData.data} />
      {selectedBuilding.selectBuilding?.type !== 'BANK' && <HeroSidebarList isLoading={placeHeroes.isLoading} heroes={placeHeroes.data} />}
    </section>
  );
};
