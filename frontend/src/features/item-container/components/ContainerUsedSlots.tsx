import { GameIcon } from '@/components/GameIcon';
import { imageConfig } from '@/shared/config/image-config';

interface Props {
  usedSlots: number;
  maxSlots: number;
  canIconShow?: boolean;
  iconSize?: string;
}

export const ContainerUsedSlots = ({ maxSlots, usedSlots, iconSize, canIconShow = true }: Props) => {
  return (
    <div className="flex items-center gap-0.5">
      {canIconShow && <GameIcon className={iconSize} image={imageConfig.icon.ui.bag} />}
      <span>{usedSlots}</span>/<span>{maxSlots}</span>
    </div>
  );
};
