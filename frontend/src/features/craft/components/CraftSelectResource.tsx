import { GameIcon } from '@/components/GameIcon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHeroInventory } from '@/features/hero/hooks/useHeroInventory';
import { cn } from '@/lib/utils';
import { Resource } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import React from 'react';

interface Props {
  resources: Resource[] | undefined;
}

export const CraftSelectResource = ({ resources }: Props) => {
  const setSelectedResource = useCraftItemStore((state) => state.setSelectedResource);
  const { calculateSumInventoryResource } = useHeroInventory();
  const sumResourceQuantity = calculateSumInventoryResource(resources!);
  return (
    <div className="">
      <Select defaultValue="IRON" onValueChange={setSelectedResource}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {resources?.map((resource) => (
            <SelectItem key={resource.id} value={resource.type} className="">
              <GameIcon className="size-6" image={resource?.gameItem?.image} />
              <p>{resource.gameItem?.name}</p>
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
    </div>
  );
};
