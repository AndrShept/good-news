import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
import { TItemContainer } from '@/shared/types';
import { memo } from 'react';

import { useCreateContainerSlots } from '../hooks/useCreateContainerSlots';
import { ItemContainerSkeleton } from './ItemContainerSkeleton';

type Props = TItemContainer & { isLoading: boolean };

export const ItemContainer = memo(({ containerSlots, maxSlots, isLoading }: Props) => {
  const items = useCreateContainerSlots(maxSlots, containerSlots);
  return (
    <ul className="flex h-fit flex-wrap gap-1">
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
  );
});
