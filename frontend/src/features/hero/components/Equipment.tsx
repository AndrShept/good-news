import { GameItemImg } from '@/components/GameItemImg';
import { ItemInstanceCard } from '@/features/item-instance/components/ItemInstanceCard';
import { BASE_EQUIPMENTS_IMAGE } from '@/lib/config';
import { cn } from '@/lib/utils';
import { EquipmentSlotType, ItemInstance } from '@/shared/types';
import { useSelectItemInstanceStore } from '@/store/useSelectItemInstanceStore';
import { memo, useMemo } from 'react';

import { useGameData } from '../hooks/useGameData';
import { CharacterSprite } from './CharacterSprite';

interface Props {
  equipments: ItemInstance[];
  characterImage: string;
}

export const Equipments = memo(function Equipments({ equipments, characterImage }: Props) {
  const equipmentBySlot = useMemo(
    () =>
      equipments.reduce(
        (acc, equip) => {
          if (!equip.slot) return acc;
          acc[equip.slot] = equip;
          return acc;
        },
        {} as Record<EquipmentSlotType, ItemInstance>,
      ),
    [equipments],
  );
  const { itemsTemplateById } = useGameData();
  const { itemInstance, setItemInstance } = useSelectItemInstanceStore();
  return (
    <div className="mx-auto flex">
      <ul className="flex flex-col gap-0.5">
        {BASE_EQUIPMENTS_IMAGE.slice(0, 5).map((equipment) => (
          <li className="flex size-12 items-center justify-center border" key={equipment.id}>
            {equipmentBySlot?.[equipment.slot] ? (
              <ItemInstanceCard
                setSelectItemOnContainer={setItemInstance}
                isSelect={itemInstance?.id === equipmentBySlot?.[equipment.slot].id}
                {...equipmentBySlot[equipment.slot]}
                itemTemplate={itemsTemplateById[equipmentBySlot[equipment.slot].itemTemplateId]}
              />
            ) : (
              <GameItemImg className="size-10 opacity-20 grayscale" image={equipment.image} />
            )}
          </li>
        ))}
      </ul>
      <CharacterSprite src={characterImage} />
      <ul className="flex flex-col gap-0.5">
        {BASE_EQUIPMENTS_IMAGE.slice(5, 10).map((equipment) => (
          <li className="flex size-12 items-center justify-center border" key={equipment.id}>
            {equipmentBySlot?.[equipment.slot] ? (
              <ItemInstanceCard
                setSelectItemOnContainer={setItemInstance}
                isSelect={itemInstance?.id === equipmentBySlot?.[equipment.slot].id}
                {...equipmentBySlot[equipment.slot]}
                itemTemplate={itemsTemplateById[equipmentBySlot[equipment.slot].itemTemplateId]}
              />
            ) : (
              <GameItemImg
                className={cn('size-10 opacity-20 grayscale', {
                  'size-8': equipment.slot === 'RING_LEFT' || equipment.slot === 'RING_RIGHT' || equipment.slot === 'AMULET',
                })}
                image={equipment.image}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
});
