import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import { HeroTravel } from '@/features/hero/api/hero-travel';
import { useTravel } from '@/features/hero/hooks/useTravel';

interface Props extends Omit<HeroTravel, 'heroId'> {
  disabled: boolean;
}

export const TravelButton = ({ disabled, type, entranceId, placeId }: Props) => {

  const { mutate, isPending } = useTravel();
  return (
    <Button variant={'secondary'} onClick={() => mutate({ type, entranceId, placeId })} disabled={isPending || disabled}>
      <TownIcon />
      <p className="truncate">Enter</p>
    </Button>
  );
};
