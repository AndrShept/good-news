import { Button } from '@/components/ui/button';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { shopBuyItems } from '@/features/hero/api/shopBuyItems';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { getItemContainerByTypeOptions } from '@/features/item-container/api/get-item-container';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  gameItemId: string;
}

export const ShopBuyButton = ({ gameItemId }: Props) => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHeroId();
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: shopBuyItems,

    async onSuccess(data) {
      await queryClient.invalidateQueries({
        queryKey: getHeroOptions().queryKey,
      });
      await queryClient.invalidateQueries({
        queryKey: getItemContainerByTypeOptions(heroId, 'BACKPACK').queryKey,
      });
      setGameMessage({
        text: data.message,
        type: 'success',
        data: { gameItemName: data.data?.gameItem?.name ?? '', quantity: data.data?.quantity },
      });
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        mutate({
          id: heroId,
          gameItemId,
        })
      }
      variant="outline"
    >
      Buy
    </Button>
  );
};
