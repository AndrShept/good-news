import { equipItem } from '@/features/hero/api/equipItem';
import { useHero } from '@/features/hero/hooks/useHero';
import { toastError } from '@/lib/utils';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { Button } from './ui/button';

interface Props {
  item: GameItem | InventoryItem | Equipment | undefined;
  onClose: () => void;
}
export const GameItemCardPopupMenu = ({ item, onClose }: Props) => {
  const heroId = useHero().id;
  const isGameItem = !(item && 'inventoryHeroId' in item) || (item && 'equipmentHeroId' in item);
  const isInventoryItem = item && 'inventoryHeroId' in item;
  const isEquipmentItem = item && 'equipmentHeroId' in item;
  const setGameMessage = useSetGameMessage();
  const isCanEquip = item && isInventoryItem && !isEquipmentItem;
  const { mutate, isPending } = useMutation({
    mutationFn: equipItem,
    onError: () => {
      toastError();
    },
    onSuccess(data, variables, context) {
      onClose();
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
  const onEquip = () => {
    mutate({
      id: heroId,
      itemId: item?.id ?? '',
    });
  };
  return (
    <section className="space-y-1 p-1">
      {isCanEquip && (
        <Button disabled={isPending} onClick={onEquip} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/equip.png" />
          <p className="text-[12px]">Equip</p>
        </Button>
      )}
      <Button variant={'ghost'} className="flex w-full items-center transition hover:text-red-500">
        <div>X</div>

        <p className="text-[12px]">Delete</p>
      </Button>
    </section>
  );
};
