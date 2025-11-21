import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Place } from '@/shared/types';
import React, { Dispatch, SetStateAction, useTransition } from 'react';
import { useMediaQuery } from 'usehooks-ts';

interface Props {
  setBuildingId: Dispatch<SetStateAction<string>>;
  place: Place | undefined;
  buildingId: string;
}

export const PlaceSidebar = ({ setBuildingId, place, buildingId }: Props) => {
  const matches = useMediaQuery('(min-width: 768px)');
  const [_, startTransition] = useTransition();
  return (
    <aside className="max-w-[200px] rounded p-1.5">
      <ul className="flex flex-col gap-1">
        {place?.buildings?.map((building) => (
          <Button
            key={building.id}
            onClick={() =>
              startTransition(() => {
                setBuildingId(building.id);
              })
            }
            className={cn('', {
              'justify-start': matches,
              'size-12': !matches,
            })}
            variant={building.id === buildingId ? 'secondary' : 'ghost'}
            size={matches ? 'default' : 'icon'}
          >
            <GameIcon
              className={cn('size-8.5', {
                'size-10': !matches,
              })}
              image={building.image}
            />

            {matches && <p>{building.name}</p>}
          </Button>
        ))}
        <Button>Game</Button>
      </ul>
    </aside>
  );
};
