import { Separator } from '@/components/ui/separator';
import { useHeroActions } from '@/features/hero/hooks/useHeroActions';
import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { StateType, TMap } from '@/shared/types';
import { memo } from 'react';

import { GatherSkillButton } from './GatherSkillButton';
import { TravelButton } from './TravelButton';
import { GatheringPanel } from './gatheringPanel';

interface Props {
  map: TMap | undefined;
  heroPosX: number;
  heroPosY: number;
  state: StateType;
  gatheringFinishAt: number | null;
}

const gatherSkills: GatheringCategorySkillKey[] = ['FISHING', 'FORAGING', 'LUMBERJACKING', 'MINING', 'SKINNING'];

export const HeroActionsBar = memo(({ heroPosX, heroPosY, map, state, gatheringFinishAt }: Props) => {
  const { entranceTile, placeTile } = useHeroActions({
    heroPosX,
    heroPosY,
    map,
  });
  const entranceId = entranceTile?.id;
  const placeId = placeTile?.id;
  const image = entranceTile ? entranceTile.image : placeTile?.image;
  return (
    <div className="flex w-full flex-row flex-wrap gap-1 sm:flex-col">
      {(entranceTile || placeTile) && (
        <TravelButton image={image ?? ''} placeId={placeId} entranceId={entranceId} disabled={state !== 'IDLE'} />
      )}

      {gatherSkills.map((gatherSkill) => (
        <GatherSkillButton key={gatherSkill} gatherSkill={gatherSkill} disabled={state !== 'IDLE'} />
      ))}

      {state !== 'IDLE' && !!gatheringFinishAt && <GatheringPanel heroState={state} gatheringFinishAt={gatheringFinishAt} />}
      {(entranceTile || placeTile) && <Separator className="hidden sm:block" />}
    </div>
  );
});
