import { calculate } from '@/shared/calculate';
import { Skill, SkillType } from '@/shared/types';
import { useMemo } from 'react';

export const useSkill = (skills: Skill[] | undefined) => {
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

  return {
    skillNextExpMap,
  };
};
