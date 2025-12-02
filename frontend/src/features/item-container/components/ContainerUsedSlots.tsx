import { GameIcon } from '@/components/GameIcon';
import { imageConfig } from '@/shared/image-config';

interface Props {
  usedSlots: number;
  maxSlots: number;
  canIconShow?: boolean;
}

export const ContainerUsedSlots = ({ maxSlots, usedSlots, canIconShow = true }: Props) => {
  return (
    <div className="flex items-center gap-0.5">
      {canIconShow && <GameIcon image={imageConfig.icon.ui.bag} />}
      <span>{usedSlots}</span>/<span>{maxSlots}</span>
    </div>
  );
};
