import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { acceptShopItems } from '@/features/hero/api/acceptShopItems';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { ShopCartItem } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useNpcStore } from '@/store/useNpcStore';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useMutation } from '@tanstack/react-query';

interface Props {
  items: ShopCartItem[];
  iconImage: string;
  btnText: string;
}

export const ShopAcceptButton = ({ items, iconImage, btnText }: Props) => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  const { clearAllItems } = useShopItemStore();
  const { npcId, npcActiveTab } = useNpcStore();
  const { updateHero } = useHeroUpdate();
  const { updateItemByDeltaEvents } = useItemContainerUpdate();

  const { mutate, isPending } = useMutation({
    mutationFn: acceptShopItems,

    async onSuccess({ message, data }) {
      updateHero({ goldCoins: data?.goldCoins });
      updateItemByDeltaEvents(data?.itemsDelta ?? []);
      clearAllItems();
      setGameMessage({
        text: message,
        color: 'YELLOW',
        data: data?.messageData,
      });
    },
  });

  return (
    <Button
      disabled={isPending || !items.length}
      onClick={() =>
        mutate({
          id: heroId,
          items,
          npcId,
          action: npcActiveTab === 'BUY' ? 'buy' : 'sell',
        })
      }
      variant={'outline'}
      className="w-fit"
    >
      <GameIcon className="size-6" image={iconImage} /> {btnText}
    </Button>
  );
};
