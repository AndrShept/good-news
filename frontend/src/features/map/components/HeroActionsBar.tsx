import { Separator } from '@/components/ui/separator';
import { StateType } from '@/shared/types';
import { memo } from 'react';

import { EnterTownButton } from './EnterTownButton';
import { FishingButton } from './FishingButton';

interface Props {
  isHeroOnTownTile: boolean | undefined;
  canFish: boolean;
  state: StateType;
}

export const HeroActionsBar = memo(({ isHeroOnTownTile, canFish, state }: Props) => {
  return (
    <>
      {isHeroOnTownTile && <EnterTownButton disabled={state !== 'IDLE'} />}
      {canFish && <FishingButton disabled={state !== 'IDLE'} />}
      {(isHeroOnTownTile || isHeroOnTownTile) && <Separator className="hidden sm:block" />}
    </>
  );
});
