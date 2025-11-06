import { ArmorInfo } from '@/components/ArmorInfo';
import { GameItemImg } from '@/components/GameItemImg';
import { ModifierInfoCard } from '@/components/ModifierInfoCard';
import { WeaponInfo } from '@/components/WeaponInfo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { materialConfig } from '@/lib/config';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { CraftItem, Modifier, Resource, ResourceType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import React, { memo, useEffect, useMemo } from 'react';

interface Props extends CraftItem {
  resources: Array<Resource> | undefined;
}
export const CraftItemCard = memo((props: Props) => {
  const resourceGroup = useMemo(
    () =>
      props.resources?.reduce(
        (acc, item) => {
          if (!item?.gameItem) return acc;
          const typedKey = item.type as ResourceType;
          acc[typedKey] = { image: item.gameItem.image, modifier: item.modifier ? item.modifier : null };
          return acc;
        },
        {} as Record<ResourceType, { image: string; modifier: Modifier | null }>,
      ),
    [props.resources],
  );
  const selectedResourceType = useCraftItemStore((state) => state.selectedResourceType);
  const setSelectedResource = useCraftItemStore((state) => state.setSelectedResource);

  useEffect(() => {
    setSelectedResource('IRON');
  }, [setSelectedResource]);
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="mb-2 space-x-1 text-lg font-semibold capitalize md:text-xl">
          <span className={cn(materialConfig[selectedResourceType].color)}>{selectedResourceType.toLocaleLowerCase()}</span>
          <span>{props?.gameItem?.name}</span>
        </div>
        <GameItemImg className="md:size-15 size-10" image={props?.gameItem?.image} />
        <p className="text-muted-foreground/30 capitalize">{props?.gameItem?.type.toLocaleLowerCase()}</p>
        {props?.gameItem?.weapon && <WeaponInfo {...props.gameItem.weapon} />}
        {props?.gameItem?.armor && <ArmorInfo {...props.gameItem.armor} />}
        <h2 className="my-1 text-xl text-yellow-300">Craft Info:</h2>
        <div>
          <div className="space-x-1">
            <span className="text-muted-foreground">skill:</span>
            <span>{props.requiredLevel}</span>
          </div>
          <div className="space-x-1">
            <span className="text-muted-foreground">craft time:</span>
            <span>{formatDurationFromSeconds(props.craftTime / 1000)}</span>
          </div>
          <ModifierInfoCard modifier={resourceGroup?.[selectedResourceType].modifier} />
        </div>

        <ul>
          {props.craftResources.map((resource) => (
            <div key={resource.type} className="flex items-center gap-1">
              <GameItemImg image={resourceGroup?.[selectedResourceType].image} />
              <p>x{resource.quantity}</p>
            </div>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
});
