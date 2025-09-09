import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';

import { useEnterTown } from '../hooks/useEnterTown';

type Props = {
  isTown: boolean;
  tileId: string;
};

export const EnterTownButton = ({ isTown, tileId }: Props) => {
  const id = useHeroId();
  const { mutate, isPending } = useEnterTown();
  return (
    <Button
      onClick={() =>
        mutate({
          id,
          tileId,
        })
      }
      disabled={!isTown || isPending}
    >
      <TownIcon /> Enter Town
    </Button>
  );
};
