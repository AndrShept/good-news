import { Separator } from '@/components/ui/separator';
import { ActionType } from '@/shared/types';

import { EnterTownButton } from './EnterTownButton';
import { FishingButton } from './FishingButton';

interface Props {
  isHeroOnTownTile: boolean | undefined;
  canFish: boolean;
  heroActionType: ActionType;
}

export const HeroActionsBar = ({ isHeroOnTownTile, canFish, heroActionType }: Props) => {
  return (
    <>
      {isHeroOnTownTile && <EnterTownButton disabled={heroActionType !== 'IDLE'} />}
      {canFish && <FishingButton disabled={heroActionType !== 'IDLE'} />}
      {(isHeroOnTownTile || isHeroOnTownTile) && <Separator />}
    </>
  );
};
