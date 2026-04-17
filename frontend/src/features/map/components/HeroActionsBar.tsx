import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useHeroActions } from '@/features/hero/hooks/useHeroActions';
import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { StateType, TMap } from '@/shared/types';
import { useIsMutating } from '@tanstack/react-query';
import { BracketsIcon } from 'lucide-react';
import { memo } from 'react';

import { GatherSkillButton } from './GatherSkillButton';
import { TravelButton } from './TravelButton';

interface Props {
  map: TMap | undefined;
  heroPosX: number;
  heroPosY: number;
  state: StateType;
  gatheringFinishAt: number | null;
  onCenter: () => void;
}

const gatherSkills: GatheringCategorySkillKey[] = ['FISHING', 'FORAGING', 'WOODCUTTING', 'MINING', 'SKINNING'];

export const HeroActionsBar = memo(({ heroPosX, heroPosY, map, state, gatheringFinishAt, onCenter }: Props) => {
  const mutationIsPending = !!useIsMutating();
  const { entranceTile, placeTile } = useHeroActions({
    heroPosX,
    heroPosY,
    map,
  });
  const entranceId = entranceTile?.id;
  const placeId = placeTile?.id;
  const image = entranceTile ? entranceTile.image : placeTile?.image;
  return (
    <div className="flex w-full select-none flex-row flex-wrap gap-1 sm:flex-col">
      <Button onClick={onCenter} variant="outline" size="icon">
        <BracketsIcon />
      </Button>
      {(entranceTile || placeTile) && (
        <TravelButton image={image ?? ''} placeId={placeId} entranceId={entranceId} disabled={state !== 'IDLE'} />
      )}

      {gatherSkills.map((gatherSkill) => (
        <GatherSkillButton key={gatherSkill} gatherSkill={gatherSkill} disabled={state !== 'IDLE' || mutationIsPending} />
      ))}

      {(entranceTile || placeTile) && <Separator className="hidden sm:block" />}
    </div>
  );
});
