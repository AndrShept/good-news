import { ConfirmPopover } from '@/components/ConfirmPopover';
import { Button } from '@/components/ui/button';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useItemUseMutation } from '@/features/hero/hooks/useItemUseMutation';
import { useDeleteContainerItem } from '@/features/item-instance/hooks/useDeleteContainerItem';
import { ItemInstance, ItemTemplate } from '@/shared/types';

interface Props extends ItemInstance {
  onClose: () => void;
  itemTemplate: ItemTemplate;
}
export const ItemInstanceCardDropdownMenu = ({ onClose, ...props }: Props) => {
  const itemUseMutation = useItemUseMutation();

  const deleteInventoryItemMutation = useDeleteContainerItem();

  const onEquip = () => {
    itemUseMutation.mutate(
      {
        itemInstanceId: props.id,
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const onDeleteInventoryItem = async () => {
    await deleteInventoryItemMutation.mutateAsync({ itemContainerId: props.itemContainerId ?? '', itemInstanceId: props.id });
    // onClose();
  };
  return (
    <section className="space-y-1 p-1">
      <Button
        disabled={itemUseMutation.isPending || deleteInventoryItemMutation.isPending}
        onClick={onEquip}
        variant={'ghost'}
        className="flex w-full items-center"
      >
        <img className="size-6" src="/sprites/icons/equip.png" />
        <p className="text-[12px]">Equip</p>
      </Button>

      {props.location === 'BACKPACK' && (
        <ConfirmPopover onConfirm={onDeleteInventoryItem} setIsShow={onClose}>
          <ConfirmPopover.Trigger>
            <Button
              disabled={itemUseMutation.isPending || deleteInventoryItemMutation.isPending}
              variant={'ghost'}
              className="flex w-full items-center transition hover:text-red-500"
            >
              <div>X</div>

              <p className="text-[12px]">Delete</p>
            </Button>
          </ConfirmPopover.Trigger>
          <ConfirmPopover.Content>
            <ConfirmPopover.Title className="text-red-500">Are you sure you want to delete item?</ConfirmPopover.Title>
            <ConfirmPopover.Message className="inline-flex">
              <p className="font-semibold">
                {props.itemTemplate.name}
                {props.quantity > 1 && <span className="font-normal text-yellow-300"> x{props.quantity}</span>}
              </p>
            </ConfirmPopover.Message>
          </ConfirmPopover.Content>
        </ConfirmPopover>
      )}
    </section>
  );
};
