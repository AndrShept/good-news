import { BuildingType } from '@/shared/types';

import { CustomTooltip } from './CustomTooltip';

interface Props {
  buildingType: BuildingType;
}

export const TownBuilding = ({ buildingType }: Props) => {
  const src: Record<BuildingType, string> = {
    'MAGIC-SHOP': '/sprites/buildings/magic-shop.png',
    'MINE-ENTRANCE': '/sprites/buildings/mine-entrance.png',
    'TOWN-HALL': '/sprites/buildings/town-hall.png',
    TEMPLE: '/sprites/buildings/temple.png',
    SHOP: '/sprites/buildings/shop.png',
    NONE: '',
  };

  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <div className="w-50">
          <img
            className="size-full transition will-change-transform hover:drop-shadow-[0_0_5px_rgba(255,255,145,0.9)]"
            style={{
              imageRendering: 'pixelated',
            }}
            src={src[buildingType]}
          />
        </div>
      </CustomTooltip.Trigger>
      <CustomTooltip.Content className="bg-background/80 rounded-md border p-3 backdrop-blur-md">{buildingType}</CustomTooltip.Content>
    </CustomTooltip>
  );
};
