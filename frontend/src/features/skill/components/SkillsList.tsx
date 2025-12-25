import { GameIcon } from '@/components/GameIcon';
import { Progress } from '@/components/ui/progress';
import { imageConfig } from '@/shared/config/image-config';
import { SkillType } from '@/shared/types';

import { useSkill } from '../hooks/useSkill';
import { SkillSkeleton } from './SkillSkeleton';

const skillIcon: Record<SkillType, string> = {
  BLACKSMITHING: imageConfig.icon.skill.BLACKSMITHING,
  ALCHEMY: imageConfig.icon.skill.ALCHEMY,
  TAILORING: imageConfig.icon.skill.TAILORING,
  MINING: imageConfig.icon.skill.MINING,
  SMELTING: imageConfig.icon.skill.SMELTING,
  MEDITATION: imageConfig.icon.skill.MEDITATION,
  REGENERATION: imageConfig.icon.skill.REGENERATION,
};

export const SkillsList = () => {
  const { skillNextExpMap, skills, isLoading } = useSkill();
  return (
    <ul className="grid grid-cols-2 gap-4">
      {!isLoading ? (
        skills?.map((skill) => (
          <li key={skill.id} className="relative flex w-full flex-col gap-1">
            <div className="inline-flex items-center justify-between gap-1 text-[15px]">
              <div className="flex w-full max-w-[115x] items-center gap-1">
                <GameIcon className="size-6" image={skillIcon[skill.type]} />
                <span className="text-muted-foreground/50 truncate">{skill.name} </span>
              </div>

              <div className="text-base font-semibold">{skill.level}</div>
            </div>
            <div className="relative flex flex-col gap-0.5">
              <Progress
                className="bg-background h-3 rounded border"
                progressClassName="bg-sky-500"
                value={(skill.currentExperience / (skillNextExpMap?.[skill.type] ?? 0)) * 100}
              />
              <div className="mx-auto inline-flex gap-1 text-xs">
                <span className="">{skill.currentExperience}</span>
                <span className="text-muted-foreground/30">/{skillNextExpMap?.[skill.type]}</span>
              </div>
            </div>
          </li>
        ))
      ) : (
        <SkillSkeleton />
      )}
    </ul>
  );
};
