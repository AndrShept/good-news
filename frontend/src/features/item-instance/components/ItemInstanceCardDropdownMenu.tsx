import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useItemUseMutation } from '@/features/hero/hooks/useItemUseMutation';
import { ItemInstance, ItemTemplate, ItemTemplateType } from '@/shared/types';
import { useModalStore } from '@/store/useModalStore';
import { X } from 'lucide-react';

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
  const onItemUse = () => {
    itemUseMutation.mutate({
      itemInstanceId: props.id,
      itemTemplateId: props.itemTemplateId,
    });
  };
  const buttonName = buttonNameVariants[props.itemTemplate.type];
  const onDeleteInventoryItem = () => {
    setModalData({ type: 'DELETE_ITEM_INSTANCE', id: props.id, itemInstance: props });
  };
  return (
    <>
      {props.location === 'BACKPACK' && buttonName && (
        <Button className='size-3' variant="ghost" size="icon" disabled={itemUseMutation.isPending} onClick={onItemUse}>
          {buttonName}
        </Button>
      )}
      {props.location === 'EQUIPMENT' && (
        <Button variant="ghost" size="icon" disabled={itemUseMutation.isPending} onClick={onItemUse}>
          unEquip
        </Button>
      )}

      {(props.location === 'BACKPACK' || props.location === 'BANK') && (
        <Button className='size-7' variant="ghost" size="icon" onClick={onDeleteInventoryItem} disabled={itemUseMutation.isPending}>
          <X />
        </Button>
      )}
    </>
  );
};
