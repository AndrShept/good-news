import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
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
  return (
    <section className="flex w-full flex-col gap-0.5">
      {!isLoading && (
        <div className="flex items-center gap-2">
          <ContainerCapacityInfo usedCapacity={itemsInstance.length} capacity={capacity} iconSize="size-6" />
        </div>
      )}
      <ul className="flex w-full flex-wrap gap-1">
        {!isLoading ? (
          items?.map((containerSlot) => {
            if (!containerSlot) {
              const id = crypto.randomUUID();
              return <GameItemSlot key={id} />;
            }
            return (
              <GameItemCard
                key={containerSlot.id}
                id={containerSlot.id}
                gameItem={containerSlot.gameItem}
                quantity={containerSlot.quantity}
                itemContainerId={containerSlot.itemContainerId}
                type="BACKPACK"
              />
            );
          })
        ) : (
          <ItemContainerSkeleton />
        )}
      </ul>
    </section>
  );
});
