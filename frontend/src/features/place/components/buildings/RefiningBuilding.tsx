import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { ItemContainerSkeleton } from '@/features/item-container/components/ItemContainerSkeleton';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { Building, RefiningBuildingKey, TPlace } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

import { useStartRefineMutation } from '../../hooks/useStartRefineMutation';

interface Props {
  selectedBuilding: Building;
  place: TPlace;
}
export const RefiningBuilding = ({ selectedBuilding, place }: Props) => {
  const heroId = useHeroId();
  const refineContainer = place.itemContainers.find((c) => c.type === selectedBuilding.key);
  const refineContainerData = useQuery(getItemContainerOptions(heroId, refineContainer?.id));
  const { filteredByRefineBuilding, backpack } = useHeroBackpack();
  const filteredBackpack = filteredByRefineBuilding(selectedBuilding.key as RefiningBuildingKey);
  const { mutate, isPending } = useStartRefineMutation();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-2xl">{selectedBuilding.name}</h1>
      {refineContainerData.isLoading ? (
        <ItemContainerSkeleton itemValue={5} />
      ) : (
        refineContainerData.data && <ItemContainer {...refineContainerData.data} />
      )}
      <Button
        onClick={() => mutate({ containerId: refineContainer?.id ?? '', refineBuildingKey: selectedBuilding.key as RefiningBuildingKey })}
        disabled={isPending}
        className="w-fit"
      >
        Refine!
      </Button>
      {!!backpack && <ItemContainer {...backpack} isShowContainerHeader={true} isCapacityLength={false} />}
    </section>
  );
};
