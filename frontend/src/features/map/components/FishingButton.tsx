import { FishIcon } from '@/components/game-icons/FichIcon';
import { Button } from '@/components/ui/button';

interface Props {
  disabled: boolean;
}

export const FishingButton = ({ disabled }: Props) => {
  return (
    <Button variant={'secondary'} disabled={disabled}>
      <FishIcon />
      <p className="truncate">Fishing</p>
    </Button>
  );
};
