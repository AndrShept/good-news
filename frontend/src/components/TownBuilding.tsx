import { useHero } from '@/features/hero/hooks/useHero';
import { useLocationChange } from '@/features/hero/hooks/useLocationChange';
import { useWalkTown } from '@/features/hero/hooks/useWalkTown';
import { cn } from '@/lib/utils';
import { BuildingType } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { ComponentProps } from 'react';

import { CustomTooltip } from './CustomTooltip';

interface Props extends ComponentProps<'div'> {
  buildingType: BuildingType;
}
export const buildingName: Record<BuildingType, string> = {
  'MAGIC-SHOP': 'Magic shop',
  'MINE-ENTRANCE': 'Mine Entrance',
  'TOWN-HALL': 'Town Hall',
  SHOP: 'Shop',
  TEMPLE: 'Temple',
  'LEAVE-TOWN': 'Leave Town',
  NONE: '',
};
export const TownBuilding = ({ buildingType, className, ...props }: Props) => {
  const src: Record<BuildingType, string> = {
    'MAGIC-SHOP': '/sprites/buildings/magic-shop.png',
    'MINE-ENTRANCE': '/sprites/buildings/mine-entrance.png',
    'TOWN-HALL': '/sprites/buildings/town-hall.png',
    TEMPLE: '/sprites/buildings/temple.png',
    SHOP: '/sprites/buildings/shop.png',
    'LEAVE-TOWN': '/sprites/buildings/leave-town.png',
    NONE: '',
  };

  const { mutate } = useWalkTown();
  const mutationLocation = useLocationChange();
  const type = useHero((state) => state?.data?.action?.type);
  const setGameMessage = useSetGameMessage();
  const onClick = () => {
    if (type !== 'IDLE') return;
    if (buildingType === 'LEAVE-TOWN') {
      mutationLocation.mutate({
        type: 'MAP',
        buildingType: 'NONE',
      });
      setGameMessage({
        type: 'info',
        text: 'You leave a town',
      });
    } else {
      mutate(buildingType);
    }
  };
  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <div onClick={onClick} className={cn('w-50', className)} {...props}>
          <img
            className="size-full transition will-change-transform hover:drop-shadow-[0_0_5px_rgba(255,255,145,0.9)]"
            style={{
              imageRendering: 'pixelated',
            }}
            src={src[buildingType]}
          />
        </div>
      </CustomTooltip.Trigger>
      <CustomTooltip.Content className="bg-background/80 rounded-md border p-2.5 backdrop-blur-md">
        {buildingName[buildingType]}
      </CustomTooltip.Content>
    </CustomTooltip>
  );
};
