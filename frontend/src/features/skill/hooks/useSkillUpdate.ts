import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { SkillInstance } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { getSkillsOptions } from '../api/get-skills';

export const useSkillUpdate = () => {
  const queryClient = useQueryClient();
  const heroId = useHeroId();
  const updateSkill = useCallback(
    (skillInstanceId: string, data: Partial<SkillInstance>) => {
      queryClient.setQueriesData<SkillInstance[]>({ queryKey: getSkillsOptions(heroId).queryKey }, (oldData) => {
        if (!oldData) return;
        return oldData.map((s) => (s.id === skillInstanceId ? { ...s, ...data } : s));
      });
    },
    [heroId],
  );

  return { updateSkill };
};
