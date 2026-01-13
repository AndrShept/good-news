import { GameItemImg } from '@/components/GameItemImg';
import { BASE_EQUIPMENTS_IMAGE } from '@/lib/config';
import { cn } from '@/lib/utils';
import { EquipmentSlotType, ItemInstance } from '@/shared/types';
import { memo } from 'react';

import { CharacterSprite } from './CharacterSprite';
import { ItemInstanceCard } from '@/features/item-instance/components/ItemInstanceCard';

interface Props {
  equipments: ItemInstance[];
  characterImage: string;
}

export const Equipments = memo(({ equipments, characterImage }: Props) => {
  const equipmentBySlot = equipments.reduce(
    (acc, equip) => {
      if (!equip.slot) return acc;
      acc[equip.slot] = equip;
      return acc;
    },
    {} as Record<EquipmentSlotType, ItemInstance>,
  );
  return (
    <div className="mx-auto flex">
      <ul className="flex flex-col gap-0.5">
        {BASE_EQUIPMENTS_IMAGE.slice(0, 5).map((equipment) => (
          <li className="flex size-12 items-center justify-center border" key={equipment.id}>
            {equipmentBySlot?.[equipment.slot] ? (
              <ItemInstanceCard  {...equipmentBySlot[equipment.slot]}/>
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
              <ItemInstanceCard  {...equipmentBySlot[equipment.slot]}/>
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
