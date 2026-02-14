import { GameItemImg } from '@/components/GameItemImg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { useSkill } from '@/features/skill/hooks/useSkill';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { recipeTemplateById } from '@/shared/templates/recipe-template';

type Props = { recipeId: string };

export const CraftRecipeItemCard = ({ recipeId }: Props) => {
  const { skillMap } = useSkill();
  const { stackedItems } = useHeroBackpack();
  const { itemsTemplateById, skillsTemplateById } = useGameData();
  const recipe = recipeTemplateById[recipeId];
  const itemTemplate = itemsTemplateById[recipe.itemTemplateId];
  return (
    <ScrollArea className="h-full">
      <section className="flex flex-1 flex-col items-center gap-1 text-[15px]">
        <GameItemImg className="md:size-15 size-11.5" image={itemTemplate.image} />
        <span className="mb-2 capitalize">{itemTemplate.name}</span>
        <div>
          <span className="text-muted-foreground">type: </span>
          <span>{itemTemplate.type.toLowerCase()}</span>
        </div>

        <div>
          <span className="text-muted-foreground">craft time:</span> <span>{formatDurationFromSeconds(recipe.timeMs)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">resources:</span>
          <ul className="flex gap-1">
            {recipe.requirement.resources.map((resource) => (
              <li key={resource.templateId} className="flex items-center">
                <GameItemImg className="size-7.5" image={itemsTemplateById[resource.templateId].image} />
                <p
                  className={cn({
                    'text-red-600': (stackedItems?.[resource.templateId] ?? 0) < resource.amount,
                  })}
                >
                  x{resource.amount}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground">skill:</span>
          <ul className="flex gap-1">
            {recipe.requirement.skills.map((skill) => (
              <li
                key={skill.skillTemplateId}
                className={cn('flex items-center gap-1', {
                  'text-red-600': (skillMap?.[skill.skillTemplateId].level ?? 0) < skill.level,
                })}
              >
                <p>{skillsTemplateById[skill.skillTemplateId].name}</p>
                <p>({skill.level})</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ScrollArea>
  );
};
