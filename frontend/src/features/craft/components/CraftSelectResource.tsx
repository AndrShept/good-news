import { GameIcon } from '@/components/GameIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { cn } from '@/lib/utils';
import { Resource } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

interface Props {
  resources: Resource[] | undefined;
}

export const CraftSelectResource = ({ resources }: Props) => {
  const setSelectedResource = useCraftItemStore((state) => state.setSelectedResource);
  const { calculateSumBackpackResource } = useHeroBackpack();
  const sumResourceQuantity = calculateSumBackpackResource(resources!);
  return (
    <>
      <Select defaultValue="IRON" onValueChange={setSelectedResource}>
        <SelectTrigger className="w-full rounded-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent side="top">
          {resources?.map((resource) => (
            <SelectItem key={resource.id} value={resource.type} >
              <GameIcon className="size-6" image={resource?.gameItem?.image} />
              <p className="truncate">{resource.gameItem?.name}</p>
              <p
                className={cn('font-semibold text-green-500', {
                  'text-red-500': !sumResourceQuantity?.[resource.type],
                })}
              >
                {sumResourceQuantity?.[resource.type] ?? 0}
              </p>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  );
};
