import { GameItemCard } from '@/components/GameItemCard';
import { GameItemSlot } from '@/components/GameItemSlot';
import { ContainerSlot } from '@/shared/types';
import { memo } from 'react';

type Props = {
  containerSlots: (ContainerSlot | null)[];
};

export const ItemContainer = memo(({ containerSlots }: Props) => {
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
            itemContainerId={containerItem.itemContainerId}
            type="BACKPACK"
          />
        );
      })}
    </ul>
  );
});
