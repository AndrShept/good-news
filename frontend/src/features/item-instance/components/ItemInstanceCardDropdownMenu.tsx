import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useItemUseMutation } from '@/features/hero/hooks/useItemUseMutation';
import { ItemInstance, ItemTemplate, ItemTemplateType } from '@/shared/types';
import { useModalStore } from '@/store/useModalStore';

interface Props extends ItemInstance {
  itemTemplate: ItemTemplate;
}
const buttonNameVariants: Record<ItemTemplateType, string> = {
  WEAPON: 'Equip',
  SHIELD: 'Equip',
  ACCESSORY: 'Equip',
  ARMOR: 'Equip',
  POTION: 'Use',
  MISC: '',
  RESOURCES: '',
};
export const ItemInstanceCardDropdownMenu = ({ ...props }: Props) => {
  const itemUseMutation = useItemUseMutation();
  const { setModalData } = useModalStore();
  const onEquip = () => {
    itemUseMutation.mutate({
      itemInstanceId: props.id,
    });
  };
  const buttonName = buttonNameVariants[props.itemTemplate.type];
  const onDeleteInventoryItem = () => {
    setModalData({ type: 'DELETE_ITEM_INSTANCE', id: props.id, itemInstance: props });
  };
  return (
    <>
      {props.location === 'BACKPACK' && buttonName && (
        <DropdownMenuItem disabled={itemUseMutation.isPending} onClick={onEquip}>
          {buttonName}
        </DropdownMenuItem>
      )}
      {props.location === 'EQUIPMENT' && (
        <DropdownMenuItem disabled={itemUseMutation.isPending} onClick={onEquip}>
          unEquip
        </DropdownMenuItem>
      )}

      {(props.location === 'BACKPACK' || props.location === 'BANK') && (
        <DropdownMenuItem onClick={onDeleteInventoryItem} disabled={itemUseMutation.isPending}>
          <p className="text-red-300">Delete</p>
        </DropdownMenuItem>
      )}
    </>
  );
};
