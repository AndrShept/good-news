
import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { imageConfig } from '@/shared/config/image-config';

interface Props {
  disabled: boolean;
}

export const FishingButton = ({ disabled }: Props) => {
  return (
    <Button variant={'secondary'} disabled={disabled}>
      <GameIcon className='size-6' image={imageConfig.icon.state.FISHING}/>
      <p className="truncate">Fishing</p>
    </Button>
  );
};
