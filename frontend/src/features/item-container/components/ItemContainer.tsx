import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
import { TItemContainer } from '@/shared/types';
import { memo } from 'react';

import { useCreateContainerSlots } from '../hooks/useCreateContainerSlots';

type Props = TItemContainer;

export const ItemContainer = memo(({ containerSlots, maxSlots }: Props) => {
  const items = useCreateContainerSlots(maxSlots, containerSlots);

  return (
    <ul className="flex h-fit flex-wrap gap-1">
      {items?.map((containerItem) => {
        if (!containerItem) {
          const id = crypto.randomUUID();
          return <GameItemSlot key={id} />;
        }
        return (
          <GameItemCard
            key={containerItem.id}
            id={containerItem.id}
            gameItem={containerItem.gameItem}
            quantity={containerItem.quantity}
            itemContainerId={containerItem.itemContainerId}
            type="BACKPACK"
          />
        );
      })}
    </ul>
  );
});
