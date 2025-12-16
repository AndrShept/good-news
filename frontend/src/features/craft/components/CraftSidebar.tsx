import { cn } from '@/lib/utils';
import { CraftItem } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { memo } from 'react';

import { SelectBaseResource } from './CraftSelectResource';

interface Props {
  craftItems: CraftItem[] | undefined;
  onSelect: (item: CraftItem) => void;
  selectedItemId: string | undefined;
}

export const CraftSidebar = memo(({ craftItems, onSelect, selectedItemId }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);

  const canShowSelectResource = selectBuilding?.type === 'BLACKSMITH';

  return (
    <aside className="sticky top-0 flex h-[calc(100%-40px)] w-full max-w-[150px] flex-col md:max-w-[200px]">
      <ul className="text-muted-foreground/60 flex flex-col gap-0.5 hover:cursor-default">
        {craftItems?.map((craftItem) => (
          <li
            key={craftItem.id}
            className={cn('px-1.5 py-0.5', {
              'bg-secondary/50 text-primary': selectedItemId === craftItem.id,
            })}
            onClick={() => onSelect(craftItem)}
          >
            {craftItem.gameItem?.name}
          </li>
        ))}
      </ul>
      <div className="mt-auto">{canShowSelectResource && <SelectBaseResource />}</div>
    </aside>
  );
});
