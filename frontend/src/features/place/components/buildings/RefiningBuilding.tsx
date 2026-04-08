import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { ItemContainerSkeleton } from '@/features/item-container/components/ItemContainerSkeleton';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { ActionTimerPanel } from '@/features/map/components/ActionTimerPanel';
import { imageConfig } from '@/shared/config/image-config';
import { Building, RefiningBuildingKey, TPlace } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';

import { useCancelRefiningMutation } from '../../hooks/useCancelRefiningMutation';
import { useStartRefineMutation } from '../../hooks/useStartRefineMutation';

interface Props {
  selectedBuilding: Building;
  place: TPlace;
}
export const RefiningBuilding = ({ selectedBuilding, place }: Props) => {
  const heroId = useHeroId();
  const refineContainer = place.itemContainers.find((c) => c.type === selectedBuilding.key);
  const refineContainerData = useQuery(getItemContainerOptions(heroId, refineContainer?.id));
  const { backpack } = useHeroBackpack();
  const { refiningFinishAt, state } = useHero((data) => ({ state: data?.state, refiningFinishAt: data?.refiningFinishAt }));
  const { mutate, isPending } = useStartRefineMutation();
  const cancelRefiningMutation = useCancelRefiningMutation();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="text-center text-2xl">{selectedBuilding.name}</h1>
      {refineContainerData.isLoading ? (
        <ItemContainerSkeleton itemValue={5} />
      ) : (
        refineContainerData.data && <ItemContainer {...refineContainerData.data} />
      )}
      <div className="flex items-center gap-1">
        <Button
          onClick={() => mutate({ containerId: refineContainer?.id ?? '', refineBuildingKey: selectedBuilding.key as RefiningBuildingKey })}
          disabled={isPending || state !== 'IDLE'}
          className="w-fit"
        >
          Refine!
        </Button>
        {!!state && state !== 'IDLE' && !!refiningFinishAt && <GameIcon className='animate-spin-slow' image={imageConfig.icon.ui.refine} />}
      </div>

      {!!state && state !== 'IDLE' && !!refiningFinishAt && (
        <ActionTimerPanel
          heroState={state}
          actionFinishAt={refiningFinishAt}
          cancelActionMutation={cancelRefiningMutation.mutate}
          cancelIsPending={cancelRefiningMutation.isPending}
          
        />
      )}
      {!!backpack && <ItemContainer {...backpack} isShowContainerHeader={true} />}
    </section>
  );
};
