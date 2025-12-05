import { ArmorInfo } from '@/components/ArmorInfo';
import { GameItemImg } from '@/components/GameItemImg';
import { ModifierInfoCard } from '@/components/ModifierInfoCard';
import { WeaponInfo } from '@/components/WeaponInfo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { materialConfig } from '@/lib/config';
import { cn, formatDurationFromSeconds } from '@/lib/utils';
import { CraftItem } from '@/shared/types';
import { useCraftItemStore } from '@/store/useCraftItemStore';

import { useCraftItem } from '../hooks/useCraftItem';

type Props = CraftItem;

export const CraftItemCard = (props: Props) => {
  const { resourceMap, getRequiredResources } = useCraftItem();
  const coreMaterialType = useCraftItemStore((state) => state.coreMaterialType);
  const { resourceCountInBackpack } = useHeroBackpack();
  const requiredResources = getRequiredResources(props.gameItem);
  return (
    <ScrollArea className="h-full">
      <div className="flex flex-1 flex-col items-center text-center">
        <div className="mb-2 space-x-1 text-lg font-semibold capitalize md:text-xl">
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
          {coreMaterialType && <ModifierInfoCard modifier={resourceMap?.[coreMaterialType].modifier} />}
        </div>
        <ul className="mt-3 flex items-center gap-1">
          {requiredResources?.map((resource) => (
            <li key={resource.type} className="flex items-center gap-1">
              <GameItemImg className="size-9" image={resourceMap?.[resource.type].image} />
              <p
                className={cn('', {
                  'text-red-500': (resourceCountInBackpack?.[resource.type] ?? 0) < resource.quantity,
                })}
              >
                x{resource.quantity}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </ScrollArea>
  );
};
