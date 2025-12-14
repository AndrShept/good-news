import { GameIcon } from '@/components/GameIcon';
import { BorderBeam } from '@/components/ui/border-beam';
import { Progress } from '@/components/ui/progress';
import { imageConfig } from '@/shared/image-config';
import { SkillType } from '@/shared/types';

import { useSkill } from '../hooks/useSkill';

const skillIcon: Record<SkillType, string> = {
  BLACKSMITHING: imageConfig.icon.skill.BLACKSMITHING,
  ALCHEMY: imageConfig.icon.skill.ALCHEMY,
  TAILORING: imageConfig.icon.skill.TAILORING,
  MINING: imageConfig.icon.skill.MINING,
  SMELTING: imageConfig.icon.skill.SMELTING,
};

export const Skills = () => {
  const { skillNextExpMap, skills, isLoading } = useSkill();

  if (isLoading) return <div>skills...</div>;

  return (
    <ul className="flex flex-col gap-2">
      {skills?.map((skill) => (
        <li key={skill.id} className="border-muted relative flex h-fit items-center gap-4 overflow-hidden rounded-xl border px-4 py-2">
          <div className="text-2xl font-semibold">{skill.level}</div>
          <div className="flex w-full flex-col gap-2">
            <div className="inline-flex justify-between gap-1 text-[15px]">
              <div className="inline-flex items-center gap-1">
                <GameIcon image={skillIcon[skill.type]} />
                <span className="text-muted-foreground/50">{skill.name}</span>
              </div>
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
          </div>
          <BorderBeam size={120} duration={100} colorFrom={'#11111'} colorTo="#818182" />
        </li>
      ))}
    </ul>
  );
};
