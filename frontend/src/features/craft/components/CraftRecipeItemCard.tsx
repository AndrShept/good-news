import { GameItemImg } from '@/components/GameItemImg';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { useSkill } from '@/features/skill/hooks/useSkill';
import { capitalize, cn, formatDurationFromSeconds } from '@/lib/utils';
import { recipeTemplateById } from '@/shared/templates/recipe-template';
import { useCraftItemStore } from '@/store/useCraftItemStore';

type Props = { recipeId: string };

export const CraftRecipeItemCard = ({ recipeId }: Props) => {
  const coreMaterialId = useCraftItemStore((state) => state.coreMaterialId);
  const { skillMap } = useSkill();
  const { itemsTemplateById } = useGameData();
  const recipe = recipeTemplateById[recipeId];
  const itemTemplate = itemsTemplateById[recipe.itemTemplateId];
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="mb-2 space-x-1 text-lg font-semibold capitalize md:text-xl">
          <span>{itemTemplate.name}</span>
        </div>
        <GameItemImg className="md:size-15 size-10" image={itemTemplate.image} />
        <p className="text-muted-foreground/30">{capitalize(itemTemplate.type)}</p>

        <h2 className="my-1.5 text-xl text-yellow-300">Craft Info:</h2>
        <div>
          {/* <ul className="flex items-center gap-1">
            {requirement?.skills?.map((skill) => (
              <li
                key={skill.type}
                className={cn('flex items-center gap-1', {
                  'text-red-500': (skillMap?.[skill.type].level ?? 0) < skill.level,
                })}
              >
                <span className="text-muted-foreground">{capitalize(skill.type)}: </span>
                <span>{skill.level}</span>
              </li>
            ))}
          </ul> */}

          {/* <div className="space-x-1">
            <span className="text-muted-foreground">Craft time:</span>
            <span>{formatDurationFromSeconds((requirement?.craftTime ?? 0) / 1000)}</span>
          </div> */}
          {/* {coreMaterialType && <ModifierInfoCard modifier={resourceMap?.[coreMaterialType].modifier} />} */}
        </div>
        {/* <ul className="mt-3 flex items-center gap-1">
          {requirement?.resources?.map((resource) => (
            <li key={resource.type} className="flex items-center gap-1">
              <GameItemImg className="size-9" image={resourceMap?.[resource.type].image} />
              <p
                className={cn('', {
                  'text-red-500': (resourceCountInBackpack?.[resource.type] ?? 0) < resource.quantity,
                })}
              >
                x{resource.quantity}
              </p>
            </li>
          ))}
        </ul> */}
      </div>
    </ScrollArea>
  );
};
