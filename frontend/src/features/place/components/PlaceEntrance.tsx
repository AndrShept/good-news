import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useTravel } from '@/features/hero/hooks/useTravel';
import { Entrance } from '@/shared/types';

interface Props {
  entrances: Entrance[] | undefined;
}

export const PlaceEntrance = ({ entrances }: Props) => {
  const { mutate, isPending } = useTravel();
  return (
    <section>
      {entrances?.map((entrance) => (
        <div>
          <Button disabled={isPending} onClick={() => mutate({ type: 'ENTRANCE', entranceId: entrance.id })}>
            <GameIcon image={entrance.image} />
            to mine
          </Button>
        </div>
      ))}
    </section>
  );
};
