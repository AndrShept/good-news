import { useWalkTown } from '@/features/hero/hooks/useWalkTown';
import { cn } from '@/lib/utils';
import { BuildingType } from '@/shared/types';
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
  NONE: '',
};
export const TownBuilding = ({ buildingType, className, ...props }: Props) => {
  const src: Record<BuildingType, string> = {
    'MAGIC-SHOP': '/sprites/buildings/magic-shop.png',
    'MINE-ENTRANCE': '/sprites/buildings/mine-entrance.png',
    'TOWN-HALL': '/sprites/buildings/town-hall.png',
    TEMPLE: '/sprites/buildings/temple.png',
    SHOP: '/sprites/buildings/shop.png',
    NONE: '',
  };

  const { mutate } = useWalkTown();
  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <div onClick={() => mutate(buildingType)} className={cn('w-50', className)} {...props}>
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
