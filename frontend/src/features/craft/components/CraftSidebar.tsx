import { ScrollArea } from '@/components/ui/scroll-area';
import { useGameData } from '@/features/hero/hooks/useGameData';
import { cn } from '@/lib/utils';
import { CraftItem } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { memo } from 'react';

import { SelectBaseResource } from './CraftSelectResource';

interface Props {
  recipeIds: { recipeId: string }[] | undefined;
  onSelect: (recipeId: string) => void;
  selectedItemId: string | undefined;
}

export const CraftSidebar = memo(({ recipeIds, onSelect, selectedItemId }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);
  const { recipeTemplateById, itemsTemplateById } = useGameData();
  const canShowSelectResource = selectBuilding?.type === 'BLACKSMITH';

  return (
    <aside className="sticky top-20 flex h-[calc(100vh-343px)] w-full max-w-[150px] flex-col md:max-w-[200px]">
      <ScrollArea className="h-full">
        <ul className="text-muted-foreground/60 flex flex-col gap-0.5 hover:cursor-default">
          {recipeIds?.map((item) => {
            const recipeTemplate = recipeTemplateById[item.recipeId];
            const itemTemplate = itemsTemplateById[recipeTemplate.itemTemplateId];
            return (
              <li
                key={recipeTemplate.id}
                className={cn('px-1.5 py-0.5', {
                  'bg-secondary/50 text-primary': selectedItemId === item.recipeId,
                })}
                onClick={() => onSelect(item.recipeId)}
              >
                {itemTemplate.name}
              </li>
            );
          })}
        </ul>
      </ScrollArea>
      <div className="mt-auto">{canShowSelectResource && <SelectBaseResource />}</div>
    </aside>
  );
});
