import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { shopBuyItems } from '@/features/hero/api/shopBuyItems';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { useItemContainerUpdate } from '@/features/item-container/hooks/useItemContainerUpdate';
import { imageConfig } from '@/shared/config/image-config';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useMutation } from '@tanstack/react-query';

interface Props {
  items: { id: string; quantity: number }[];
}

export const ShopBuyButton = ({ items }: Props) => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const { clearAllItems, onClose } = useShopItemStore();
  const { updateHero } = useHeroUpdate();
  const { updateItemContainer } = useItemContainerUpdate();
  const { mutate, isPending } = useMutation({
    mutationFn: shopBuyItems,

    async onSuccess({ message, data }) {
      updateHero({ goldCoins: data?.goldCoins });
      updateItemContainer(backpackId, data?.itemContainer);
      onClose();
      clearAllItems();
      setGameMessage({
        text: message,
        type: 'WARNING',
        data: data?.messageData,
      });
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        mutate({
          id: heroId,
          items,
        })
      }
      variant={'outline'}
      className="flex-1"
    >
      <GameIcon className="size-6" image={imageConfig.icon.ui.buy} /> Buy
    </Button>
  );
};
