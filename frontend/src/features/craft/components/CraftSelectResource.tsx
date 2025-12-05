import { GameIcon } from '@/components/GameIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { cn } from '@/lib/utils';
import { ResourceType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCraftItem } from '../hooks/useCraftItem';

export const SelectBaseResource = () => {
  const setCoreMaterial = useCraftItemStore((state) => state.setCoreMaterial);
  const { filteredResourcesBySelectBuilding } = useCraftItem();
  const { resourceCountInBackpack } = useHeroBackpack();

  return (
    <>
      <Select defaultValue={filteredResourcesBySelectBuilding?.[0].type} onValueChange={(type: ResourceType) => setCoreMaterial(type)}>
        <SelectTrigger className="w-full rounded-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {filteredResourcesBySelectBuilding?.map((resource) => (
            <SelectItem key={resource.id} value={resource.type}>
              <GameIcon className="size-6" image={resource?.gameItem?.image} />
              <p className="truncate">{resource.gameItem?.name}</p>
              <p
                className={cn('font-semibold text-green-500', {
                  'text-red-500': !resourceCountInBackpack?.[resource.type],
                })}
              >
                {resourceCountInBackpack?.[resource.type] ?? 0}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
