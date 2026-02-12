import { GameIcon } from '@/components/GameIcon';
import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import { HeroTravel } from '@/features/hero/api/hero-travel';
import { useTravel } from '@/features/hero/hooks/useTravel';

interface Props extends Omit<HeroTravel, 'heroId'> {
  disabled: boolean;
  image: string;
}

export const TravelButton = ({ disabled, entranceId, placeId, image }: Props) => {
  const { mutate, isPending } = useTravel();
  return (
    <Button variant={'secondary'} onClick={() => mutate({ entranceId, placeId })} disabled={isPending || disabled}>
      <GameIcon image={image} />
      <p className="truncate">Enter</p>
    </Button>
  );
};
