import { ScrollArea } from '@/components/ui/scroll-area';
import { useHero } from '@/features/hero/hooks/useHero';
import { imageConfig } from '@/shared/config/image-config';
import { buildingTemplate } from '@/shared/templates/building-template';
import { CraftBuildingKey, Entrance, RefiningBuildingKey, StateType, TPlace } from '@/shared/types';
import { useSelectPlaceEntitiesStore } from '@/store/useSelectPlaceEntitiesStore';
import { useEffect } from 'react';
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
  CARPENTRY: 'CARPENTER',
  SAWMILLING: 'SAWMILL',
  TANNING: 'TANNERY',
  WEAVING: 'LOOM',
};
export const PlaceSidebar = ({ place, entrances }: Props) => {
  const isMobile = useMediaQuery('(min-width: 768px)');
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
        <ul className="flex flex-col gap-1">
          <PlaceSidebarButton
            isActive={!selectedPlaceEntities}
            isMobile={isMobile}
            disabled={isButtonDisabled}
            name={'Town info'}
            image={imageConfig.icon.ui.town}
            onClick={() => setSelectedPlaceEntities(null)}
          />
          {place?.buildingIds.map((buildingId) => {
            return (
              <PlaceSidebarButton
                key={buildingId}
                isActive={buildingId === selectedPlaceEntities?.payload.id}
                isMobile={isMobile}
                disabled={isButtonDisabled}
                type={'BUILDING'}
                id={buildingId}
              />
            );
          })}
          {place?.npcIds.map((npcId) => {
            return (
              <PlaceSidebarButton
                key={npcId}
                isActive={npcId === selectedPlaceEntities?.payload.id}
                isMobile={isMobile}
                disabled={isButtonDisabled}
                type={'NPC'}
                id={npcId}
              />
            );
          })}

          <PlaceSidebarButton
            isActive={false}
            isMobile={isMobile}
            disabled={isButtonDisabled}
            name={'Leave place'}
            image={imageConfig.icon.ui.leave}
            onClick={() => {
              setSelectedPlaceEntities(null);
              mutate();
            }}
          />
        </ul>
      </ScrollArea>
    </aside>
  )
}
