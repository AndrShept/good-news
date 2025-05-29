import { GameItemCard } from '@/components/GameItemCard';
import { cn } from '@/lib/utils';
import { Equipment, EquipmentSlotType } from '@/shared/types';

import { CharacterSprite } from './CharacterSprite';

interface Props {
  equipments: Equipment[];
}

interface EquipmentImage {
  id: number;
  image: string;
  slot: EquipmentSlotType;
}
const BASE_EQUIPMENTS_IMAGE: EquipmentImage[] = [
  {
    id: 1,
    slot: 'HELMET',
    image: '/sprites/icons/helmet.png',
  },
  {
    id: 2,
    slot: 'CHESTPLATE',
    image: '/sprites/icons/armor.png',
  },
  {
    id: 3,
    slot: 'BELT',
    image: '/sprites/icons/belt.png',
  },
  {
    id: 4,
    slot: 'LEGS',
    image: '/sprites/icons/legs.png',
  },
  {
    id: 5,
    slot: 'BOOTS',
    image: '/sprites/icons/boots.png',
  },

  {
    id: 8,
    slot: 'AMULET',
    image: '/sprites/icons/amulet.png',
  },
  {
    id: 9,
    slot: 'RING_LEFT',
    image: '/sprites/icons/ring.png',
  },
  {
    id: 10,
    slot: 'RING_RIGHT',
    image: '/sprites/icons/ring.png',
  },
  {
    id: 6,
    slot: 'RIGHT_HAND',
    image: '/sprites/icons/weapon.png',
  },
  {
    id: 7,
    slot: 'LEFT_HAND',
    image: '/sprites/icons/shield.png',
  },
];

export const Equipments = ({ equipments }: Props) => {
  const equipmentBySlot = equipments.reduce(
    (acc, equip) => {
      acc[equip.slot] = equip;
      return acc;
    },
    {} as Record<EquipmentSlotType, Equipment>,
  );
  console.log(equipmentBySlot);
  return (
    <div className="flex">
      <ul className="flex flex-col gap-0.5">
        {BASE_EQUIPMENTS_IMAGE.slice(0, 5).map((equipment) => (
          <li className="flex size-12 border" key={equipment.id}>
            {equipmentBySlot?.[equipment.slot] ? (
              <GameItemCard item={equipmentBySlot[equipment.slot]} />
            ) : (
              <img
                style={{ imageRendering: 'pixelated' }}
                className={cn('size-full opacity-15 grayscale', {
                  'm-auto size-8': equipment.slot === 'RING_LEFT' || equipment.slot === 'RING_RIGHT' || equipment.slot === 'AMULET',
                })}
                src={equipment.image}
                alt="equip_slot_image"
              />
            )}
          </li>
        ))}
      </ul>
      <CharacterSprite src={'/sprites/new/newb-mage.webp'} />
      <ul className="flex flex-col gap-0.5">
        {BASE_EQUIPMENTS_IMAGE.slice(5, 10).map((equipment) => (
          <li className="flex size-12 border" key={equipment.id}>
            {equipmentBySlot?.[equipment.slot] ? (
              <GameItemCard item={equipmentBySlot[equipment.slot]} />
            ) : (
              <img
                style={{ imageRendering: 'pixelated' }}
                className={cn('size-full opacity-15 grayscale', {
                  'm-auto size-8': equipment.slot === 'RING_LEFT' || equipment.slot === 'RING_RIGHT' || equipment.slot === 'AMULET',
                })}
                src={equipment.image}
                alt="equip_slot_image"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
