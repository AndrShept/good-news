import { GameIcon } from '@/components/GameIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import { useSelectBuildingStore } from '@/store/useSelectBuildingStore';

import { useCraft } from '../hooks/useCraft';

export const SelectBaseResource = () => {
  const setCoreMaterialId = useCraftItemStore((state) => state.setCoreMaterialId);
  const selectBuilding = useSelectBuildingStore();
  const { filterResourceByBuilding } = useCraft(selectBuilding.selectBuilding?.type);

  return (
    <>
      <Select defaultValue={filterResourceByBuilding?.[0].id} onValueChange={setCoreMaterialId}>
        <SelectTrigger className="w-full rounded-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {filterResourceByBuilding?.map((resourceTemplate) => (
            <SelectItem key={resourceTemplate.id} value={resourceTemplate.id}>
              <GameIcon className="size-6" image={resourceTemplate.image} />
              <p className="truncate">{resourceTemplate.name}</p>
              {/* <p
                className={cn('font-semibold text-green-500', {
                  'text-red-500': !resourceCountInBackpack?.[template.resourceInfo!.type],
                })}
              >
                {resourceCountInBackpack?.[template.resourceInfo!.type] ?? 0}
              </p> */}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
