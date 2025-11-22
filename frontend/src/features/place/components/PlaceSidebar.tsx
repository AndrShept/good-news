import { GameIcon } from '@/components/GameIcon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { imageConfig } from '@/lib/config';
import { capitalize, cn } from '@/lib/utils';
import { Place } from '@/shared/types';
import React, { Dispatch, SetStateAction, useTransition } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { useLeavePlace } from '../hooks/useLeavePlace';
import { PlaceSidebarButton } from './PlaceSidebarButton';

interface Props {
  setBuildingId: Dispatch<SetStateAction<string>>;
  place: Place | undefined;
  buildingId: string;
}

export const PlaceSidebar = ({ setBuildingId, place, buildingId }: Props) => {
  const matches = useMediaQuery('(min-width: 768px)');
  const [_, startTransition] = useTransition();
  const { mutate, isPending } = useLeavePlace();
  return (
    <aside className="top-18 sticky h-[calc(100vh-330px)] max-w-[200px] rounded p-1.5">
      <ScrollArea className="h-full">
        <ul className="flex flex-col gap-1.5">
          <PlaceSidebarButton
            disabled={isPending}
            matches={matches}
            variant={!buildingId ? 'secondary' : 'ghost'}
            size={matches ? 'default' : 'icon'}
            onClick={() => setBuildingId('')}
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
              disabled={isPending}
              variant={building.id === buildingId ? 'secondary' : 'ghost'}
              size={matches ? 'default' : 'icon'}
              onClick={() =>
                startTransition(() => {
                  setBuildingId(building.id);
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
            disabled={isPending}
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
            {matches && <p>Leave {capitalize(place?.type)}</p>}
          </PlaceSidebarButton>
        </ul>
      </ScrollArea>
    </aside>
  );
};
