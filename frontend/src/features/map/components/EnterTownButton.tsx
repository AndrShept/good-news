import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';

import { useEnterPlace } from '../hooks/useEnterPlace';

interface Props {
  disabled: boolean;
}

export const EnterTownButton = ({ disabled }: Props) => {
  const id = useHeroId();
  const { mutate, isPending } = useEnterPlace();
  return (
    <Button variant={'secondary'} onClick={() => mutate(id)} disabled={isPending || disabled}>
      <TownIcon />
      <p className="truncate">Enter Town</p>
    </Button>
  );
};
