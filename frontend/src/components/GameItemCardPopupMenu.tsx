import { equipItem } from '@/features/hero/api/equipItem';
import { toastError } from '@/lib/utils';
import { GameItem } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { Button } from './ui/button';
import { useHero } from '@/features/hero/hooks/useHero';

interface Props {
  gameItem: GameItem | undefined;
  quantity?: number;
}
export const GameItemCardPopupMenu = ({ gameItem, quantity }: Props) => {
  const heroId = useHero().id
  const setGameMessage = useSetGameMessage();
  const { mutate, isPending } = useMutation({
    mutationFn: equipItem,
    onError: () => {
      toastError();
    },
    onSuccess(data, variables, context) {
      if (data.success) {
        setGameMessage({
          success: true,
          type: 'success',
          text: data.message,
        });
      } else {
        setGameMessage({
          success: false,
          type: 'error',
          text: data.message,
        });
      }
    },
  });
  return (
    <section className="space-y-1 p-1">
      <Button onClick={() => mutate({
        id: heroId,
        itemId: gameItem.
      })} variant={'ghost'} className="flex w-full items-center">
        <img className="size-6" src="/sprites/icons/equip.png" />
        <p className="text-[12px]">Equip</p>
      </Button>
      <Button variant={'ghost'} className="flex w-full items-center transition hover:text-red-500">
        <div>X</div>

        <p className="text-[12px]">Delete</p>
      </Button>
    </section>
  );
};
