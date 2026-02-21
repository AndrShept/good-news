import { GatheringCategorySkillKey } from '@/shared/templates/skill-template';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';

import { gatherResource } from '../api/gather-resource';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useGatherResourceMutation = () => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();

  const { updateHero } = useHeroUpdate();

  return useMutation({
    mutationFn: ({ gatherSkill }: { gatherSkill: GatheringCategorySkillKey }) => gatherResource({ heroId, gatherSkill }),

    async onSuccess(data) {
      updateHero({ state: data.data?.state, gatheringFinishAt: data.data?.gatheringFinishAt });
      setGameMessage({ type: 'SUCCESS', text: data.message });
     
    },
  });
};
