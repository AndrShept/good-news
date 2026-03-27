import { useHero } from '@/features/hero/hooks/useHero';
import { EntitySidebar } from '@/features/map/components/EntitySidebar';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectBuildingStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getPlaceOptions } from '../api/get-place';
import { getPlaceHeroesLocationOptions } from '../api/get-place-heroes';
import { PlaceSidebar } from './PlaceSidebar';
import { SelectedPlaceEntitiesPage } from './SelectedPlaceEntitiesPage';

export const Place = () => {
  const placeId = useHero((data) => data?.location?.placeId ?? '');
  const placeData = useQuery(getPlaceOptions(placeId));
  const placeHeroes = useQuery(getPlaceHeroesLocationOptions(placeId));
  const { selectedPlaceEntities, setSelectedPlaceEntities } = useSelectPlaceEntitiesStore();
  const clearAllItems = useShopItemStore((state) => state.clearAllItems);

  useEffect(() => {
    return () => {
      setSelectedPlaceEntities(null);
      clearAllItems();
    };
  }, []);
  if (placeData.isLoading) return <p>LOADING ...</p>;
  return (
    <section className="mx-auto flex w-full">
      <PlaceSidebar entrances={placeData.data?.entrances ?? []} place={placeData.data} />
      <SelectedPlaceEntitiesPage place={placeData.data} />
      {selectedPlaceEntities?.type === 'BUILDING' &&  selectedPlaceEntities.payload.key !== 'BANK' && (
        <EntitySidebar mode="PLACE" isLoading={placeHeroes.isLoading} heroes={placeHeroes.data} corpses={undefined} creatures={undefined} />
      )}
    </section>
  );
};
