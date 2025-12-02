import { cn } from '@/lib/utils';
import { ApiGetCraftItemResponse, ArmorType, CraftItem, WeaponType } from '@/shared/types';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';
import { memo, useEffect } from 'react';

import { useCraftItem } from '../hooks/useCraftItem';
import { SelectBaseResource } from './CraftSelectResource';

interface Props {
  data: ApiGetCraftItemResponse;
  onSelect: (item: CraftItem) => void;
  selectedItemId: string | undefined;
}

export const CraftSidebar = memo(({ data, onSelect, selectedItemId }: Props) => {
  const selectBuilding = useSelectBuildingStore((state) => state.selectBuilding);

  const canShowSelectResource = selectBuilding?.type === 'BLACKSMITH';


  return (
    <aside className="flex w-full max-w-[150px] flex-col md:max-w-[200px]">
      <ul className="text-muted-foreground flex flex-col gap-0.5">
        {data?.craftItems.map((craftItem) => (
          <div
          key={craftItem.id}
            className={cn('', {
              'bg-secondary/30 text-primary': selectedItemId === craftItem.id,
            })}
            onClick={() => onSelect(craftItem)}
          >
            {craftItem.gameItem?.name}
          </div>
        ))}
      </ul>
      <div className="mt-auto">{canShowSelectResource && <SelectBaseResource />}</div>
    </aside>
  );
});
