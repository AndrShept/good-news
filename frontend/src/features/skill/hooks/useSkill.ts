import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { calculate } from '@/shared/calculate';
import { Skill, SkillType } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getSkillsOptions } from '../api/get-skills';

export const useSkill = () => {
  const heroId = useHeroId();
  const { data: skills, isLoading } = useQuery(getSkillsOptions(heroId));
  const skillNextExpMap = useMemo(
    () =>
      skills?.reduce(
        (acc, skill) => {
          acc[skill.type] = calculate.getExpSkillToNextLevel(skill.type, skill.level);
          return acc;
        },
        {} as Record<SkillType, number>,
      ),
    [skills],
  );
  const skillMap = useMemo(
    () =>
      skills?.reduce(
        (acc, skill) => {
          acc[skill.type] = skill;
          return acc;
        },
        {} as Record<SkillType, Skill>,
      ),
    [skills],
  );

  return {
    skillNextExpMap,
    skillMap,
    isLoading,
    skills,
  };
};
