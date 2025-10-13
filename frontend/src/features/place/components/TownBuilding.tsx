import { useHero } from '@/features/hero/hooks/useHero';
import { cn } from '@/lib/utils';
import { Building } from '@/shared/types';

import { CustomTooltip } from '../../../components/CustomTooltip';
import { useWalkPlace } from '@/features/hero/hooks/useWalkTown';

type Props = Building;

export const TownBuilding = ({ image, name, type }: Props) => {
  const { mutate } = useWalkPlace();

  const heroType = useHero((state) => state?.data?.action?.type);
  const onClick = () => {
    if (heroType === 'WALK') return;
    mutate(type);
  };

  return (
    <CustomTooltip>
      <CustomTooltip.Trigger>
        <div onClick={onClick} className={cn('w-50')}>
          <img
            className="size-full transition will-change-transform hover:drop-shadow-[0_0_5px_rgba(255,255,145,0.9)]"
            style={{
              imageRendering: 'pixelated',
            }}
            src={image}
          />
        </div>
      </CustomTooltip.Trigger>
      <CustomTooltip.Content className="bg-background/80 rounded-md border p-2.5 backdrop-blur-md">
        {name}
      </CustomTooltip.Content>
    </CustomTooltip>
  );
};
