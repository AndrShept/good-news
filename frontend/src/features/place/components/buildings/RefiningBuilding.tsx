import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { ItemContainerSkeleton } from '@/features/item-container/components/ItemContainerSkeleton';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { Building, RefiningBuildingKey, TPlace } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

interface Props {
  selectedBuilding: Building;
  place: TPlace;
}
export const RefiningBuilding = ({ selectedBuilding, place }: Props) => {
  const heroId = useHeroId();
  const refineContainer = place.itemContainers.find((c) => c.type === selectedBuilding.key)
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
      <Button>Refine</Button>
      {!!filteredBackpack && <ItemContainer {...filteredBackpack} />}
    </section>
  );
};
