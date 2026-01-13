import { GameIcon } from '@/components/GameIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { cn } from '@/lib/utils';
import { CoreMaterialType, ResourceType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';



export const SelectBaseResource = () => {
  const setCoreMaterial = useCraftItemStore((state) => state.setCoreMaterial);
  const { filteredResourcesBySelectBuilding } = useCraftItem();
  const { resourceCountInBackpack } = useHeroBackpack();

  return (
    <>
      <Select defaultValue={filteredResourcesBySelectBuilding?.[0].type} onValueChange={(type: CoreMaterialType) => setCoreMaterial(type)}>
        <SelectTrigger className="w-full rounded-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {filteredResourcesBySelectBuilding?.map((template) => (
            <SelectItem key={template.id} value={template.resourceInfo!.type}>
              <GameIcon className="size-6" image={template.image} />
              <p className="truncate">{template.name}</p>
              <p
                className={cn('font-semibold text-green-500', {
                  'text-red-500': !resourceCountInBackpack?.[template.resourceInfo!.type],
                })}
              >
                {resourceCountInBackpack?.[template.resourceInfo!.type] ?? 0}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
