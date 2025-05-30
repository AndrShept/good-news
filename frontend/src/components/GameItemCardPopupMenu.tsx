import { unEquipItem } from '@/features/hero/api/un-equip-Item';
import { useEquipItem } from '@/features/hero/hooks/useEquipItem';
import { useHero } from '@/features/hero/hooks/useHero';
import { useUnEquipItem } from '@/features/hero/hooks/useUnEquipItem';
import { Equipment, GameItem, InventoryItem } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { Button } from './ui/button';

interface Props {
  item: GameItem | InventoryItem | Equipment | undefined;
  onClose: () => void;
}
export const GameItemCardPopupMenu = ({ item, onClose }: Props) => {
  const heroId = useHero().id;
  const isGameItem = !(item && 'inventoryHeroId' in item) || (item && 'equipmentHeroId' in item);
  const inventoryItem = item && 'inventoryHeroId' in item ? item : (undefined as InventoryItem | undefined);
  const equipmentItem = item && 'equipmentHeroId' in item ? item : (undefined as Equipment | undefined);
  const isPotionItem = inventoryItem?.gameItem.type === 'POTION';
  const isMiscItem = inventoryItem?.gameItem.type === 'POTION';
  const gameItem = isGameItem ? undefined : (item as unknown as GameItem | undefined);
  const isCanEquip = item && inventoryItem && !equipmentItem && !isPotionItem && !isMiscItem;
  const equipItemMutation = useEquipItem();
  const unEquipItemMutation = useUnEquipItem();

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
  const onDrink = () => {};
  return (
    <section className="space-y-1 p-1">
      {isCanEquip && (
        <Button disabled={equipItemMutation.isPending} onClick={onEquip} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/equip.png" />
          <p className="text-[12px]">Equip</p>
        </Button>
      )}
      {equipmentItem && (
        <Button disabled={unEquipItemMutation.isPending} onClick={unOnEquip} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/equip.png" />
          <p className="text-[12px]">un equip</p>
        </Button>
      )}
      {isPotionItem && (
        <Button onClick={onDrink} variant={'ghost'} className="flex w-full items-center">
          <img className="size-6" src="/sprites/icons/health-potion.png" />
          <p className="text-[12px]">Drink</p>
        </Button>
      )}
      <Button variant={'ghost'} className="flex w-full items-center transition hover:text-red-500">
        <div>X</div>

        <p className="text-[12px]">Delete</p>
      </Button>
    </section>
  );
};
