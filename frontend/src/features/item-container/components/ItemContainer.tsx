import { useGameData } from '@/features/hero/hooks/useGameData';
import { GameItemSlot } from '@/features/item-instance/components/GameItemSlot';
import { ItemInstanceCard } from '@/features/item-instance/components/ItemInstanceCard';
import { TItemContainer } from '@/shared/types';
import { memo } from 'react';

import { useCreateContainerItems } from '../hooks/useCreateContainerItems';
import { ContainerCapacityInfo } from './ContainerCapacityInfo';
import { ItemContainerSkeleton } from './ItemContainerSkeleton';

interface Props extends TItemContainer {
  isLoading: boolean;
}

export const ItemContainer = memo(({ capacity, itemsInstance, isLoading }: Props) => {
  const items = useCreateContainerItems(capacity, itemsInstance);
  const { itemsTemplateById } = useGameData();
  return (
    <section className="flex w-full flex-col gap-0.5">
      {!isLoading && (
        <div className="flex items-center gap-2">
          <ContainerCapacityInfo usedCapacity={itemsInstance.length} capacity={capacity} iconSize="size-6" />
        </div>
      )}
      <ul className="flex w-full flex-wrap gap-1">
        {!isLoading ? (
          items?.map((itemInstance) => {
            if (!itemInstance) {
              const id = crypto.randomUUID();
              return <GameItemSlot key={id} />;
            }
            const itemTemplate = itemsTemplateById[itemInstance.itemTemplateId];
            return <ItemInstanceCard {...itemInstance} itemTemplate={itemTemplate} />;
          })
        ) : (
          <ItemContainerSkeleton />
        )}
      </ul>
    </section>
  );
});
