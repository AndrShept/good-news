import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { HeroBackpack } from '@/features/item-container/components/HeroBackpack';
import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { ItemContainerSkeleton } from '@/features/item-container/components/ItemContainerSkeleton';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { Building, RefiningBuildingKey } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

export const RefiningBuilding = ({ selectedBuilding }: { selectedBuilding: Building }) => {
  const heroId = useHeroId();
  const refineContainer = useHero((data) => data?.itemContainers.find((c) => c.type === selectedBuilding.key));
  const refineContainerData = useQuery(getItemContainerOptions(heroId, refineContainer?.id));
  const { filteredByRefineBuilding } = useHeroBackpack();
  const filteredBackpack = filteredByRefineBuilding(selectedBuilding.key as RefiningBuildingKey);

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-2xl">{selectedBuilding.name}</h1>
      {refineContainerData.isLoading ? (
        <ItemContainerSkeleton itemValue={5} />
      ) : (
        refineContainerData.data && <ItemContainer {...refineContainerData.data} />
      )}

      {!!filteredBackpack && <ItemContainer {...filteredBackpack} />}
    </section>
  );
};
