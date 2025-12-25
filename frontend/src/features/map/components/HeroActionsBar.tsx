import { Separator } from '@/components/ui/separator';

import { EnterTownButton } from './EnterTownButton';
import { FishingButton } from './FishingButton';
import { StateType } from '@/shared/types';

interface Props {
  isHeroOnTownTile: boolean | undefined;
  canFish: boolean;
  state: StateType;
}

export const HeroActionsBar = ({ isHeroOnTownTile, canFish, state }: Props) => {
  return (
    <>
      {isHeroOnTownTile && <EnterTownButton disabled={state !== 'IDLE'} />}
      {canFish && <FishingButton disabled={state !== 'IDLE'} />}
      {(isHeroOnTownTile || isHeroOnTownTile) && <Separator />}
    </>
  );
};
