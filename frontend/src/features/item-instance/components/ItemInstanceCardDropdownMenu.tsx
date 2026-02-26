import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { useItemConsumeMutation } from '@/features/hero/hooks/useItemConsumeMutation';
import { useItemEquipMutation } from '@/features/hero/hooks/useItemEquipMutation';
import { imageConfig } from '@/shared/config/image-config';
import { ItemInstance, ItemTemplate, ItemTemplateType } from '@/shared/types';
import { useModalStore } from '@/store/useModalStore';
import { useSelectItemInstanceStore } from '@/store/useSelectItemInstanceStore';
import { X } from 'lucide-react';
import { ReactElement } from 'react';

interface Props extends ItemInstance {
  itemTemplate: ItemTemplate;
}
const buttonIconVariants: Record<Exclude<ItemTemplateType, 'MISC' | 'RESOURCES'>, ReactElement> = {
  WEAPON: <GameIcon className="size-5.5" image={imageConfig.icon.action.equip} />,
  TOOL: <GameIcon className="size-5.5" image={imageConfig.icon.action.equip} />,
  SHIELD: <GameIcon className="size-5.5" image={imageConfig.icon.action.equip} />,
  ACCESSORY: <GameIcon className="size-5.5" image={imageConfig.icon.action.equip} />,
  ARMOR: <GameIcon className="size-5.5" image={imageConfig.icon.action.equip} />,
  POTION: <GameIcon className="size-6.5" image={imageConfig.icon.action.drink} />,
  SKILL_BOOK: <GameIcon className="size-6" image={imageConfig.icon.action.read} />,
};
export const ItemInstanceCardDropdownMenu = ({ ...props }: Props) => {
  const itemConsumeMutation = useItemConsumeMutation();
  const itemEquipMutation = useItemEquipMutation();
  const isDisabled = itemConsumeMutation.isPending || itemEquipMutation.isPending;
  const setItemInstance = useSelectItemInstanceStore((state) => state.setItemInstance);
  const { setModalData } = useModalStore();
  const onItemConsume = () => {
    itemConsumeMutation.mutate({
      itemInstanceId: props.id,
      itemTemplateId: props.itemTemplateId,
    });
    setItemInstance(null);
  };
  const onItemEquip = () => {
    itemEquipMutation.mutate({
      itemInstanceId: props.id,
      itemTemplateId: props.itemTemplateId,
    });
    setItemInstance(null);
  };
  const icon = buttonIconVariants[props.itemTemplate.type as Exclude<ItemTemplateType, 'MISC' | 'RESOURCES'>];
  const onDeleteInventoryItem = () => {
    setModalData({ type: 'DELETE_ITEM_INSTANCE', id: props.id, itemInstance: props });
  };
  return (
    <>
      {props.location === 'BACKPACK' && !props.itemTemplate.equipInfo && icon && (
        <Button
          variant="ghost"
          className="w-10 opacity-70 hover:bg-transparent hover:opacity-100"
          disabled={isDisabled}
          onClick={onItemConsume}
        >
          {icon}
        </Button>
      )}
      {props.location === 'BACKPACK' && !!props.itemTemplate.equipInfo && icon && (
        <Button
          variant="ghost"
          className="w-10 opacity-70 hover:bg-transparent hover:opacity-100"
          disabled={isDisabled}
          onClick={onItemEquip}
        >
          {icon}
        </Button>
      )}
      {props.location === 'EQUIPMENT' && (
        <Button
          className="w-10 opacity-70 hover:bg-transparent hover:opacity-100"
          variant="ghost"
          disabled={isDisabled}
          onClick={onItemEquip}
        >
          <GameIcon className="size-5" image={imageConfig.icon.action.unEquip} />
        </Button>
      )}

      {(props.location === 'BACKPACK' || props.location === 'BANK') && (
        <Button
          className="w-10 opacity-70 hover:bg-transparent hover:opacity-100"
          variant="ghost"
          onClick={onDeleteInventoryItem}
          disabled={isDisabled}
        >
          <X className="size-8 text-red-500/40" />
        </Button>
      )}
    </>
  );
};
