import { useDrinkPotion } from '@/features/hero/hooks/useDrinkPotion';
import { useEquipItem } from '@/features/hero/hooks/useEquipItem';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useUnEquipItem } from '@/features/hero/hooks/useUnEquipItem';
import { useDeleteContainerSlotItem } from '@/features/item-container/hooks/useDeleteContainerSlotItem';
import { GameItem } from '@/shared/types';

import { ConfirmPopover } from './ConfirmPopover';
import { GameCartType } from './GameItemCard';
import { Button } from './ui/button';

interface Props {
  onClose: () => void;
  id: string;
  gameItem: GameItem;
  quantity: number;
  type: GameCartType;
  itemContainerId?: string;
}
export const GameItemCardPopupMenu = ({ gameItem, id, quantity, onClose, type, itemContainerId }: Props) => {
  const heroId = useHeroId();
  const isCanEquip =
    (gameItem.type === 'WEAPON' || gameItem.type === 'ARMOR' || gameItem.type === 'SHIELD' || gameItem.type === 'ACCESSORY') &&
    type !== 'EQUIP';
  const isPotionItem = gameItem.type === 'POTION';
  const equipItemMutation = useEquipItem();
  const unEquipItemMutation = useUnEquipItem();
  const drinkPotionMutation = useDrinkPotion();
  const deleteInventoryItemMutation = useDeleteContainerSlotItem(itemContainerId ?? '');
  const isMutationPending =
    equipItemMutation.isPending || deleteInventoryItemMutation.isPending || unEquipItemMutation.isPending || drinkPotionMutation.isPending;
  const onEquip = () => {
    equipItemMutation.mutate(
      {
        id: heroId,
        inventoryItemId: id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };
  const unOnEquip = () => {
    unEquipItemMutation.mutate(
      {
        id: heroId,
        equipmentItemId: id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };
  const onDrink = () => {
    drinkPotionMutation.mutate(
      {
        id: heroId,
        inventoryItemId: id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };
  const onDeleteInventoryItem = () => {
    deleteInventoryItemMutation.mutate({ containerSlotId: id });
    onClose();
  };
  return (
    <section className="space-y-1 p-1">
      {isCanEquip && (
        <Button disabled={isMutationPending} onClick={onEquip} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/equip.png" />
          <p className="text-[12px]">Equip</p>
        </Button>
      )}
      {isPotionItem && (
        <Button disabled={isMutationPending} onClick={onDrink} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/health-potion.png" />
          <p className="text-[12px]">Drink</p>
        </Button>
      )}

      {type === 'EQUIP' && (
        <Button disabled={isMutationPending} onClick={unOnEquip} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/equip.png" />
          <p className="text-[12px]">un equip</p>
        </Button>
      )}
      {type === 'BACKPACK' && (
        <ConfirmPopover onConfirm={onDeleteInventoryItem} setIsShow={onClose}>
          <ConfirmPopover.Trigger>
            <Button disabled={isMutationPending} variant={'ghost'} className="flex w-full items-center transition hover:text-red-500">
              <div>X</div>

              <p className="text-[12px]">Delete</p>
            </Button>
          </ConfirmPopover.Trigger>
          <ConfirmPopover.Content>
            <ConfirmPopover.Title className="text-rose-500">Are you sure you want to delete item?</ConfirmPopover.Title>
            <ConfirmPopover.Message className="inline-flex">
              <p className="font-semibold">
                {gameItem?.name}
                {quantity > 1 && <span className="font-normal text-yellow-300"> x{quantity}</span>}
              </p>
            </ConfirmPopover.Message>
          </ConfirmPopover.Content>
        </ConfirmPopover>
      )}
    </section>
  );
};
