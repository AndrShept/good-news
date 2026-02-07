import { GameIcon } from '@/components/GameIcon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHero } from '@/features/hero/hooks/useHero';
import { capitalize, cn } from '@/lib/utils';
import { imageConfig } from '@/shared/config/image-config';
import { buildingTemplate } from '@/shared/templates/building-template';
import { BuildingType, CraftBuildingType, StateType, TPlace } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { startTransition, useEffect } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { useLeavePlace } from '../hooks/useLeavePlace';
import { PlaceSidebarButton } from './PlaceSidebarButton';

interface Props {
  place: TPlace | undefined;
}
const stateToBuildingMap: Partial<Record<StateType, CraftBuildingType>> = {
  SMELTING: 'FORGE',
  TAILORING: 'TAILOR',
  ALCHEMY: 'ALCHEMY',
  BLACKSMITHING: 'BLACKSMITH',
};
export const PlaceSidebar = ({ place }: Props) => {
  const matches = useMediaQuery('(min-width: 768px)');
  const { mutate, isPending } = useLeavePlace();
  const { selectBuilding, setSelectBuilding } = useSelectBuildingStore();
  const state = useHero((data) => data?.state);
  const isButtonDisabled = isPending || state !== 'IDLE';
 useEffect(() => {
  if (!state) return;

  const buildingIdForState = stateToBuildingMap[state];
  if (!buildingIdForState) return;

  const buildingForState = buildingTemplate[buildingIdForState];
  setSelectBuilding(buildingForState);
}, []);

  return (
    <aside className="top-18 sticky h-[calc(100vh-330px)] max-w-[200px] rounded p-1.5">
      <ScrollArea className="h-full">
        <ul className="flex flex-col gap-1.5">
          <PlaceSidebarButton
            disabled={isButtonDisabled}
            matches={matches}
            variant={!selectBuilding ? 'secondary' : 'ghost'}
            size={matches ? 'default' : 'icon'}
            onClick={() => setSelectBuilding(null)}
          >
            <GameIcon
              className={cn('size-7.5', {
                'size-8.5': !matches,
              })}
              image={place?.type === 'TOWN' ? imageConfig.icon.ui.town : imageConfig.icon.ui.dungeon}
            />
            {matches && <p>{capitalize(place?.type)} Info</p>}
          </PlaceSidebarButton>
          {place?.buildings?.map((building) => (
            <PlaceSidebarButton
              key={building.id}
              matches={matches}
              disabled={isButtonDisabled}
              variant={building.id === selectBuilding?.id ? 'secondary' : 'ghost'}
              size={matches ? 'default' : 'icon'}
              onClick={() =>
                startTransition(() => {
                  setSelectBuilding(building);
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
            {matches && <p className="text-red-300">Leave {capitalize(place?.type)}</p>}
          </PlaceSidebarButton>
        </ul>
      </ScrollArea>
    </aside>
  );
};
