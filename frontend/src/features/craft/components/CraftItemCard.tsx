import { ArmorInfo } from '@/components/ArmorInfo';
import { GameItemImg } from '@/components/GameItemImg';
import { WeaponInfo } from '@/components/WeaponInfo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatDurationFromSeconds } from '@/lib/utils';
import { CraftItem, Resource, ResourceType } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';
import React, { memo, useMemo } from 'react';

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
          acc[typedKey] = item.gameItem.image;
          return acc;
        },
        {} as Record<ResourceType, string>,
      ),
    [props.resources],
  );
  const selectedResourceType = useCraftItemStore((state) => state.selectedResourceType);
  return (
    <>
      <h3 className="text-lg font-semibold capitalize md:text-xl">{props?.gameItem?.name}</h3>
      <GameItemImg className="md:size-15 size-10" image={props?.gameItem?.image} />
      <p className="text-muted-foreground/30 capitalize">{props?.gameItem?.type.toLocaleLowerCase()}</p>
      {props?.gameItem?.weapon && <WeaponInfo {...props.gameItem.weapon} />}
      {props?.gameItem?.armor && <ArmorInfo {...props.gameItem.armor} />}
      <h2 className="my-2 text-xl">Craft Info:</h2>
      <div className="flex items-center gap-1">
        <p className="text-muted-foreground">skill:</p>
        <p>{props.requiredLevel}</p>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-muted-foreground">craft time:</p>
        <p>{formatDurationFromSeconds(props.craftTime / 1000)}</p>
      </div>
      <ul>
        {props.craftResources.map((resource) => (
          <div key={resource.type} className="flex items-center gap-1">
            <GameItemImg image={resourceGroup?.[selectedResourceType]} />
            <p>x{resource.quantity}</p>
          </div>
        ))}
      </ul>
    </>
  );
});
