import { GameIcon } from '@/components/GameIcon';
import { imageConfig } from '@/shared/config/image-config';

interface Props {
  usedCapacity: number;
  capacity: number;
  canIconShow?: boolean;
  iconSize?: string;
}

export const ContainerCapacityInfo = ({ capacity, usedCapacity, iconSize, canIconShow = true }: Props) => {
  return (
    <div className="flex items-center gap-0.5">
      {canIconShow && <GameIcon className={iconSize} image={imageConfig.icon.ui.bag} />}
      <span>{usedCapacity}</span>/<span>{capacity}</span>
    </div>
  );
};
