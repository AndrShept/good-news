import { GameIcon } from '@/components/GameIcon';
import { Progress } from '@/components/ui/progress';
import { useGameData } from '@/features/hero/hooks/useGameData';

import { useSkill } from '../hooks/useSkill';
import { SkillSkeleton } from './SkillSkeleton';

export const SkillsList = () => {
  const { skills, isLoading } = useSkill();
  const { skillsTemplateById } = useGameData();

  return (
    <ul className="grid grid-cols-2 gap-4">
      {!isLoading ? (
        skills?.map((skill) => {
          const template = skillsTemplateById[skill.skillTemplateId];
          return (
            <li key={skill.id} className="relative flex w-full flex-col gap-1">
              <div className="inline-flex items-center justify-between gap-1 text-[15px]">
                <div className="flex w-full max-w-[115x] items-center gap-1">
                  <GameIcon className="size-6" image={template.image} />
                  <span className="text-muted-foreground truncate">{template.name} </span>
                </div>

                <div className="text-base font-semibold">{skill.level}</div>
              </div>
              <div className="relative flex flex-col gap-0.5">
                <Progress
                  className="bg-background h-3 rounded border"
                  progressClassName="bg-sky-500"
                  value={(skill.currentExperience / skill.expToLvl) * 100}
                />
                <div className="mx-auto inline-flex gap-1 text-xs">
                  <span className="">{skill.currentExperience}</span>
                  <span className="text-muted-foreground">/{skill.expToLvl}</span>
                </div>
              </div>
            </li>
          );
        })
      ) : (
        <SkillSkeleton />
      )}
    </ul>
  );
};
