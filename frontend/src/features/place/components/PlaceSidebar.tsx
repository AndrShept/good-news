import { GameIcon } from '@/components/GameIcon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHero } from '@/features/hero/hooks/useHero';
import { cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { buildingTemplate } from '@/shared/templates/building-template';
import { CraftBuildingKey, Entrance, RefiningBuildingKey, StateType, TPlace } from '@/shared/types';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectBuildingStore';
import { memo, startTransition, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { useLeavePlace } from '../hooks/useLeavePlace';
import { PlaceSidebarButton } from './PlaceSidebarButton';

interface Props {
  place: TPlace | undefined;
  entrances: Entrance[] | null;
}
type StateBuilding = Extract<
  StateType,
  'SMELTING' | 'TAILORING' | 'ALCHEMY' | 'BLACKSMITHING' | 'CARPENTRY' | 'SMELTING' | 'TANNING' | 'WEAVING' | 'SAWMILLING'
>;
const stateToBuildingMap: Record<StateBuilding, CraftBuildingKey | RefiningBuildingKey> = {
  SMELTING: 'FORGE',
  TAILORING: 'TAILOR',
  ALCHEMY: 'ALCHEMY',
  BLACKSMITHING: 'BLACKSMITH',
  CARPENTRY: 'CARPENTRY',
  SAWMILLING: 'SAWMILL',
  TANNING: 'TANNERY',
  WEAVING: 'LOOM',
};
export const PlaceSidebar = memo(({ place, entrances }: Props) => {
  const matches = useMediaQuery('(min-width: 768px)');
  const { mutate, isPending } = useLeavePlace();
  const { selectedPlaceEntities, setSelectedPlaceEntities } = useSelectPlaceEntitiesStore();
  const state = useHero((data) => data?.state);
  const isButtonDisabled = isPending || state !== 'IDLE';
  useEffect(() => {
    if (!state) return;

    const buildingIdForState = stateToBuildingMap[state as StateBuilding];
    if (!buildingIdForState) return;

    const buildingForState = buildingTemplate.find((b) => b.key === buildingIdForState);
    if (buildingForState) {
      setSelectedPlaceEntities({ type: 'BUILDING', payload: buildingForState });
    }
  }, []);

  return (
    <aside className="top-18 sticky h-[calc(100vh-330px)] max-w-[200px] rounded p-1.5">
      <ScrollArea className="h-full">
        <ul className="flex flex-col gap-1.5">
          <PlaceSidebarButton
            disabled={isButtonDisabled}
            matches={matches}
            variant={!selectedPlaceEntities ? 'secondary' : 'ghost'}
            size={matches ? 'default' : 'icon'}
            onClick={() => {
              setSelectedPlaceEntities(null);
            }}
          >
            <GameIcon
              className={cn('size-7.5', {
                'size-8.5': !matches,
              })}
              image={imageConfig.icon.ui.town}
            />
            {matches && <p>Place Info</p>}
          </PlaceSidebarButton>

          {selectedPlaceEntities?.type === 'BUILDING' &&
            place?.buildings?.map((building) => (
              <PlaceSidebarButton
                key={building.id}
                matches={matches}
                disabled={isButtonDisabled}
                variant={building.id === selectedPlaceEntities.payload.id ? 'secondary' : 'ghost'}
                size={matches ? 'default' : 'icon'}
                onClick={() =>
                  startTransition(() => {
                    setSelectedPlaceEntities({ type: 'BUILDING', payload: building });
                  })
                }
              >
                <GameIcon
                  className={cn('size-8.5', {
                    'size-10': !matches,
                  })}
                  image={building.image}
                />
                {matches && <p>{building.name}</p>}
              </PlaceSidebarButton>
            ))}

          <PlaceSidebarButton
            className="hover:bg-red-500/10"
            matches={matches}
            disabled={isButtonDisabled}
            variant={'ghost'}
            size={matches ? 'default' : 'icon'}
            onClick={() => mutate()}
          >
            <GameIcon
              className={cn('size-7.5', {
                'size-8.5': !matches,
              })}
              image={imageConfig.icon.ui.leave}
            />
            {matches && <p className="text-red-300">Leave place</p>}
          </PlaceSidebarButton>
        </ul>
      </ScrollArea>
    </aside>
  );
});
