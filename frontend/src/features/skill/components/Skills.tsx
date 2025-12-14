import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useQuery } from '@tanstack/react-query';

import { getSkillsOptions } from '../api/get-skills';
import { useSkill } from '../hooks/useSkill';
import { MagicCard } from '@/components/ui/magic-card';

export const Skills = () => {
  const heroId = useHeroId();
  const { data: skills, isLoading } = useQuery(getSkillsOptions(heroId));
  const { skillNextExpMap } = useSkill(skills);
  if (isLoading) return <div>skills...</div>;
  return (
    <section className="flex flex-col">
      <ul className="flex flex-col gap-2">
        {skills?.map((skill) => (
          <MagicCard key={skill.id}>
            <li key={skill.id} className="flex flex-col gap-1 p-4">
              <div className="inline-flex justify-between gap-1 text-[15px]">
                <span className="text-muted-foreground">{skill.name}:</span>
                <span className="font-semibold">{skill.level}</span>
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
          </MagicCard>
        ))}
      </ul>
    </section>
  );
};
