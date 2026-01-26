import { GameItemImg } from '@/components/GameItemImg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { useSkill } from '@/features/skill/hooks/useSkill';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { useCraftItemStore } from '@/store/useCraftItemStore';

type Props = { recipeId: string };

export const CraftRecipeItemCard = ({ recipeId }: Props) => {
  const coreMaterialId = useCraftItemStore((state) => state.coreMaterialId);
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
          <span className="text-muted-foreground/50">type: </span>
          <span>{itemTemplate.type.toLowerCase()}</span>
        </div>

        <div>
          <span className="text-muted-foreground/50">craft time:</span> <span>{formatDurationFromSeconds(recipe.timeMs)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground/50">resorces:</span>
          <ul className="flex gap-1">
            {recipe.requirement.resources.map((resoure) => (
              <li className="flex items-center">
                <GameItemImg className="size-7.5" image={itemsTemplateById[resoure.templateId].image} />
                <p
                  className={cn({
                    'text-red-600': (stackedItems?.[resoure.templateId] ?? 0) < resoure.amount,
                  })}
                >
                  x{resoure.amount}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground/50">skill:</span>
          <ul className="flex gap-1">
            {recipe.requirement.skills.map((skill) => (
              <li
                className={cn('flex items-center gap-1', {
                  'text-red-600': (skillMap?.[skill.skillId].level ?? 0) < skill.level,
                })}
              >
                <p>{skillsTemplateById[skill.skillId].name}</p>
                <p>({skill.level})</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ScrollArea>
  );
};
