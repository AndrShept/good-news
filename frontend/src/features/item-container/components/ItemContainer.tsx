import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
import { ContainerSlot, ItemContainerType } from '@/shared/types';
import { memo } from 'react';

type Props = {
  containerSlots: (ContainerSlot | null)[];
  type: ItemContainerType;
};

export const ItemContainer = memo(({ containerSlots, type }: Props) => {
  return (
    <ul className="flex h-fit flex-wrap gap-1">
      {containerSlots?.map((containerItem, idx) => {
        if (!containerItem) return <GameItemSlot key={idx} />;
        return (
          <GameItemCard
            key={containerItem.id}
            id={containerItem.id}
            gameItem={containerItem.gameItem}
            quantity={containerItem.quantity}
            containerType={type}
            type="BACKPACK"
          />
        );
      })}
    </ul>
  );
});
