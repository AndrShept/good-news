import { MapIcon } from '@/components/game-icons/MapIcon';
import { Button } from '@/components/ui/button';

import { useLeaveTown } from '../hooks/useLeaveTown';

export const LeaveTownButton = () => {
  const { mutate, isPending } = useLeaveTown();

  const onClick = () => {
    mutate();
  };
  return (
    <Button disabled={isPending} onClick={onClick} variant="outline" className="mx-auto w-fit">
      <MapIcon />
      Leave Town
    </Button>
  );
};
