import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { shopBuyItems } from '@/features/hero/api/shopBuyItems';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerOptions } from '@/features/item-container/api/get-item-container';
import { useGetBackpackId } from '@/features/item-container/hooks/useGetBackpackId';
import { imageConfig } from '@/shared/config/image-config';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useShopItemStore } from '@/store/useShopItemStore';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  items: { id: string; quantity: number }[];
}

export const ShopBuyButton = ({ items }: Props) => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  const backpackId = useGetBackpackId();
  const queryClient = useQueryClient();
  const { clearAllItems, onClose } = useShopItemStore();
  const { mutate, isPending } = useMutation({
    mutationFn: shopBuyItems,

    async onSuccess({ message, data }) {
      await queryClient.invalidateQueries({
        queryKey: getItemContainerOptions(heroId, backpackId).queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      onClose();
      clearAllItems();
      setGameMessage({
        text: message,
        type: 'SUCCESS',
        data: data,
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
      <GameIcon image={imageConfig.icon.ui['gold-bag']} /> Buy
    </Button>
  );
};
