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
    mutationFn: ({ skillKey }: { skillKey: GatheringCategorySkillKey }) => gatherResource({ heroId, skillKey }),

    async onSuccess(data, { skillKey }) {
      
    },
  });
};
