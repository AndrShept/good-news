import { useHero } from '@/features/hero/hooks/useHero';
import { useWalkTown } from '@/features/hero/hooks/useWalkTown';
import { cn } from '@/lib/utils';
import { Building, TownToBuildings, buildingNameType } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';

import { CustomTooltip } from '../../../components/CustomTooltip';

type Props = TownToBuildings;
export const buildingName: Record<buildingNameType, string> = {
  'MAGIC-SHOP': 'Magic shop',
  TEMPLE: 'Temple',
};
export const TownBuilding = ({ building }: Props) => {
  const { mutate } = useWalkTown();

  const type = useHero((state) => state?.data?.action?.type);
  const setGameMessage = useSetGameMessage();

  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <div className={cn('w-50')}>
          <img
            className="size-full transition will-change-transform hover:drop-shadow-[0_0_5px_rgba(255,255,145,0.9)]"
            style={{
              imageRendering: 'pixelated',
            }}
            src={building.image}
          />
        </div>
      </CustomTooltip.Trigger>
      <CustomTooltip.Content className="bg-background/80 rounded-md border p-2.5 backdrop-blur-md">
        {buildingName[building.name]}
      </CustomTooltip.Content>
    </CustomTooltip>
  );
};
