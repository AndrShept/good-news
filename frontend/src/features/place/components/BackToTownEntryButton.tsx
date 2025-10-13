import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import { useBackTownEntry } from '@/features/hero/hooks/useBackTownEntry';

export const BackToTownEntryButton = () => {
  const { mutate, isPending } = useBackTownEntry();
  return (
    <Button disabled={isPending} onClick={() => mutate()} variant="outline" className="w-fit">
      <TownIcon />
      <p>Back</p>
    </Button>
  );
};
