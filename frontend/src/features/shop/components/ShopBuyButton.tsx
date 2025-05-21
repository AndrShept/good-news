import { Button } from '@/components/ui/button';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { getInventoryOptions } from '@/features/hero/api/get-inventory';
import { shopBuyItems } from '@/features/hero/api/shopBuyItems';
import { useHero } from '@/features/hero/hooks/useHero';
import { toastError } from '@/lib/utils';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface Props {
  itemId: string;
}

export const ShopBuyButton = ({ itemId }: Props) => {
  const setGameMessage = useSetGameMessage();
  const heroId = useHero().id;
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: shopBuyItems,
    onError: () => {
      toastError();
    },
    async onSuccess(data) {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: getHeroOptions().queryKey,
        });
        await queryClient.invalidateQueries({
          queryKey: getInventoryOptions(heroId).queryKey,
        });
        setGameMessage({ text: data.message, type: 'success', data: data.data });
      }
      if (!data.success && data.isShowError) {
        setGameMessage({ text: data.message, type: 'error' });
      }
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() =>
        mutate({
          id: heroId,
          itemId,
        })
      }
      variant={'outline'}
      className=""
    >
      Buy
    </Button>
  );
};
