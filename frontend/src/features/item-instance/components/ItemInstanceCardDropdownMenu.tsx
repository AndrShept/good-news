import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { useItemUseMutation } from '@/features/hero/hooks/useItemUseMutation';
import { imageConfig } from '@/shared/config/image-config';
import { ItemInstance, ItemTemplate, ItemTemplateType } from '@/shared/types';
import { useModalStore } from '@/store/useModalStore';
import { X } from 'lucide-react';
import { ReactElement } from 'react';

interface Props extends ItemInstance {
  itemTemplate: ItemTemplate;
}
const buttonIconVariants: Record<Exclude<ItemTemplateType, 'MISC' | 'RESOURCES'>, ReactElement> = {
  WEAPON: <GameIcon className="size-5.5 opacity-70 hover:opacity-100" image={imageConfig.icon.action.equip} />,
  SHIELD: <GameIcon className="size-5.5 opacity-70 hover:opacity-100" image={imageConfig.icon.action.equip} />,
  ACCESSORY: <GameIcon className="size-5.5 opacity-70 hover:opacity-100" image={imageConfig.icon.action.equip} />,
  ARMOR: <GameIcon className="size-5.5 opacity-70 hover:opacity-100" image={imageConfig.icon.action.equip} />,
  POTION: <GameIcon className="size-7 opacity-70 hover:opacity-100" image={imageConfig.icon.action.drink} />,
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
  const icon = buttonIconVariants[props.itemTemplate.type as Exclude<ItemTemplateType, 'MISC' | 'RESOURCES'>];
  const onDeleteInventoryItem = () => {
    setModalData({ type: 'DELETE_ITEM_INSTANCE', id: props.id, itemInstance: props });
  };
  return (
    <>
      {props.location === 'BACKPACK' && icon && (
        <Button variant="ghost" className="p-0 hover:bg-transparent" disabled={itemUseMutation.isPending} onClick={onItemUse}>
          {icon}
        </Button>
      )}
      {props.location === 'EQUIPMENT' && (
        <Button className="p-0 hover:bg-transparent" variant="ghost" disabled={itemUseMutation.isPending} onClick={onItemUse}>
          <GameIcon className="size-5 opacity-70 hover:opacity-100" image={imageConfig.icon.action.unEquip} />
        </Button>
      )}

      {(props.location === 'BACKPACK' || props.location === 'BANK') && (
        <Button className="p-0  hover:bg-transparent" variant="ghost" onClick={onDeleteInventoryItem} disabled={itemUseMutation.isPending}>
            <GameIcon className="size-7.5 opacity-70 hover:opacity-100" image={imageConfig.icon.action.close} />
        </Button>
      )}
    </>
  );
};
