import { useBackTownEntry } from '@/features/hero/hooks/useBackTownEntry';
import React from 'react';

import { TownIcon } from '../game-icons/TownIcon';
import { Button } from '../ui/button';

export const BackToTownEntryButton = () => {
  const { mutate, isPending } = useBackTownEntry();
  return (
    <Button disabled={isPending} onClick={() => mutate()} variant="outline" className="w-fit">
      <TownIcon />
      <p>Back</p>
    </Button>
  );
};
