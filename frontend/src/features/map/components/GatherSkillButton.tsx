import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useGatherResourceMutation } from '@/features/hero/hooks/useGatherResourceMutation';
import { capitalize } from '@/lib/utils';

import { imageConfig } from '@/shared/config/image-config';
import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { getHeroStateWithGatherSkillKey } from '@/shared/utils';

interface Props {
  disabled: boolean;
  gatherSkill: GatheringCategorySkillKey;
}

export const GatherSkillButton = ({ disabled, gatherSkill }: Props) => {
  const { mutate, isPending } = useGatherResourceMutation();
  const state = getHeroStateWithGatherSkillKey(gatherSkill);
  return (
    <Button
      onClick={() => mutate({  gatherSkill })}
      variant={'secondary'}
      disabled={disabled || isPending || gatherSkill === 'SKINNING'}
    >
      <GameIcon className="size-6" image={imageConfig.icon.state[state]} />
      <p className="truncate">{capitalize(gatherSkill)}</p>
    </Button>
  );
};
