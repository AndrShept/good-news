import { useDeleteInventoryItem } from '@/features/hero/hooks/useDeleteInventoryItem';
import { useDrinkPotion } from '@/features/hero/hooks/useDrinkPotion';
import { useEquipItem } from '@/features/hero/hooks/useEquipItem';
import { useHero } from '@/features/hero/hooks/useHero';
import { useUnEquipItem } from '@/features/hero/hooks/useUnEquipItem';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';

import { ConfirmPopover } from './ConfirmPopover';
import { Button } from './ui/button';

interface Props {
  item: GameItem | InventoryItem | Equipment | undefined;
  onClose: () => void;
}
export const GameItemCardPopupMenu = ({ item, onClose }: Props) => {
  const  heroId  = useHero(state => state?.data?.id ?? '');
  const isGameItem = !(item && 'inventoryHeroId' in item) || (item && 'equipmentHeroId' in item);
  const inventoryItem = item && 'inventoryHeroId' in item ? item : (undefined as InventoryItem | undefined);
  const equipmentItem = item && 'equipmentHeroId' in item ? item : (undefined as Equipment | undefined);
  const isPotionItem = inventoryItem?.gameItem?.type === 'POTION';
  const isMiscItem = inventoryItem?.gameItem?.type === 'MISC';
  const gameItem = isGameItem ? undefined : (item as unknown as GameItem | undefined);
  const isCanEquip = item && inventoryItem && !equipmentItem && !isPotionItem && !isMiscItem;

  const equipItemMutation = useEquipItem();
  const unEquipItemMutation = useUnEquipItem();
  const drinkPotionMutation = useDrinkPotion();
  const deleteInventoryItemMutation = useDeleteInventoryItem(inventoryItem?.id ?? '');
  const isMutationPending = equipItemMutation.isPending || deleteInventoryItemMutation.isPending || unEquipItemMutation.isPending;
  const onEquip = () => {
    equipItemMutation.mutate(
      {
        id: heroId,
        itemId: inventoryItem?.id ?? '',
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
        itemId: equipmentItem?.id ?? '',
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
        itemId: inventoryItem?.id ?? '',
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };
  const onDeleteInventoryItem = () => {
    deleteInventoryItemMutation.mutate();
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

      {equipmentItem && (
        <Button disabled={isMutationPending} onClick={unOnEquip} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/equip.png" />
          <p className="text-[12px]">un equip</p>
        </Button>
      )}
      {inventoryItem && (
        <ConfirmPopover onConfirm={onDeleteInventoryItem} setIsShow={onClose}>
          <ConfirmPopover.Trigger>
            <Button disabled={isMutationPending} variant={'ghost'} className="flex w-full items-center transition hover:text-red-500">
              <div>X</div>

              <p className="text-[12px]">Delete</p>
            </Button>
          </ConfirmPopover.Trigger>
          <ConfirmPopover.Content>
            <ConfirmPopover.Title>Are you sure you want to delete item?</ConfirmPopover.Title>
            <ConfirmPopover.Message className="inline-flex text-yellow-500">
              <p>
                {inventoryItem.gameItem?.name}
                {inventoryItem.quantity > 1 && <span className="text-primary"> x{inventoryItem.quantity}</span>}
              </p>
            </ConfirmPopover.Message>
          </ConfirmPopover.Content>
        </ConfirmPopover>
      )}
    </section>
  );
};
