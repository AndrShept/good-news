import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';

import { useEnterTown } from '../hooks/useEnterTown';

export const EnterTownButton = () => {
  const id = useHeroId();
  const { mutate, isPending } = useEnterTown();
  return (
    <Button onClick={() => mutate(id)} disabled={isPending}>
      <TownIcon /> Enter Town
    </Button>
  );
};
