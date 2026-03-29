import { GameItemImg } from '@/components/GameItemImg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { useSkill } from '@/features/skill/hooks/useSkill';
import { TINT_COLOR } from '@/lib/config';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { ColoredResourceType } from '@/shared/types';

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
        <GameItemImg tintColor={null} className="md:size-15 size-11.5" image={itemTemplate.image} />
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
          <ul className="flex items-center gap-1">
            {recipe.requirement.materials.map((material, idx) => {
              if ( !material.templateId) {
                return (
                  <li key={idx} className="lowercase">
                    {material.categories?.join(' or ')}
                    <span className="ml-1">x{material.amount}</span>
                  </li>
                );
              }
              const materialTemplate = itemsTemplateById[material.templateId];
              return (
                <li key={material.templateId} className="flex items-center">
                  <GameItemImg
                    tintColor={TINT_COLOR[materialTemplate.key as ColoredResourceType]}
                    className="size-7.5"
                    image={itemsTemplateById[material.templateId!].image}
                  />
                  <p
                    className={cn({
                      'text-red-600': (stackedItems?.[material.templateId] ?? 0) < material.amount,
                    })}
                  >
                    x{material.amount}
                  </p>
                </li>
              );
            })}
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
