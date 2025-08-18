import { CustomTooltip } from '@/components/CustomTooltip';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useLocationChange } from '@/features/hero/hooks/useLocationChange';
import { WorldObject } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import React, { useState } from 'react';

import { useChangeMap } from '../hooks/useChangeMap';

interface Props extends WorldObject {
  tileId: string;
}

export const WorldObjectTile = (props: Props) => {
  const { image, tileId, name } = props;
  const { changeTile } = useChangeMap('SOLMERE');
  const { mutate, isPending } = useLocationChange();
  const setGameMessage = useSetGameMessage();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <CustomTooltip>
        <CustomTooltip.Trigger>
          <PopoverTrigger>
            <img
              // onClick={() =>
              //   changeTile({
              //     tileId,
              //     params: {
              //       worldObject: undefined,
              //       worldObjectId: undefined,
              //     },
              //   })
              // }
              draggable={false}
              className="absolute left-0 top-0 size-full hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.9)]"
              style={{ imageRendering: 'pixelated' }}
              src={image}
            />
          </PopoverTrigger>
        </CustomTooltip.Trigger>
        {!isOpen && <CustomTooltip.Content className="p-3">{name}</CustomTooltip.Content>}
      </CustomTooltip>
      <PopoverContent sideOffset={20} side="right" align={'center'} className="flex w-fit flex-col gap-1 p-0.5">
        <Button
          onClick={() =>
            mutate(
              {
                type: 'TOWN',
                buildingType: 'NONE',
                name: 'SOLMERE'
              },
              {
                onSuccess: () =>
                  setGameMessage({
                    text: `Your enter the town ${name}`,
                    type: 'success',
                  }),
              },
            )
          }
          disabled={isPending}
          className="w-15 h-7"
          variant={'secondary'}
          size={'sm'}
        >
          Enter
        </Button>
        <Button className="w-15 h-7" variant={'secondary'} size={'sm'}>
          Leave
        </Button>
      </PopoverContent>
    </Popover>
  );
};
