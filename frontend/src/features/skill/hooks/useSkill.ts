import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { SkillKey, skillTemplateById } from '@/shared/templates/skill-template';
import { SkillInstance } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import { getSkillsOptions } from '../api/get-skills';

export const useSkill = () => {
  const heroId = useHeroId();
  const { data: skills, isLoading } = useQuery(getSkillsOptions(heroId));
  // const skillNextExpMap = useMemo(
  //   () =>
  //     skills?.reduce(
  //       (acc, skill) => {
  //         const template = skillTemplateById[skill.skillTemplateId];
  //         acc[template.key] = calculate.getExpSkillToNextLevel(template.key, skill.level);
  //         return acc;
  //       },
  //       {} as Record<SkillKey, number>,
  //     ),
  //   [skills],
  // );
  const skillMap = useMemo(
    () =>
      skills?.reduce(
        (acc, skill) => {
          const template = skillTemplateById[skill.skillTemplateId];
          acc[template.key] = skill;
          return acc;
        },
        {} as Record<SkillKey, SkillInstance>,
      ),
    [skills],
  );

  return {
    skillMap,
    isLoading,
    skills,
  };
};
