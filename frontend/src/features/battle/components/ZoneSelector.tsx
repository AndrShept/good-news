import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BattleShieldZoneType, BattleZoneType, EquipmentSlotType, battleShieldZoneValues, battleZoneValues } from '@/shared/types';
import { useState } from 'react';

interface Props {
  isEquipLeftHandWeapon: boolean;
  isEquipRightHandWeapon: boolean;
  isEquipShield: boolean;
}

export const ZoneSelector = ({ isEquipLeftHandWeapon, isEquipRightHandWeapon, isEquipShield }: Props) => {
  const [selectedAttackingZone, setSelectedAttackingZone] = useState<
    Record<Extract<EquipmentSlotType, 'LEFT_HAND' | 'RIGHT_HAND'>, BattleZoneType | null>
  >({
    LEFT_HAND: isEquipLeftHandWeapon ? 'CHEST' : null,
    RIGHT_HAND: isEquipRightHandWeapon ? 'CHEST' : null,
  });
  const [selectedDefenseZone, setSelectedDefenseZone] = useState<BattleZoneType | BattleShieldZoneType>('CHEST');
  const defenseZoneValues = isEquipShield ? battleShieldZoneValues : battleZoneValues;

  return (
    <section className="mx-auto flex flex-col gap-2 text-nowrap md:flex-row">
      <ul className="flex w-fit flex-col gap-1">
        <p className="text-center text-yellow-400">ATTACK</p>
        {battleZoneValues.map((zone) => (
          <li key={zone} className="flex select-none items-center gap-1 ">
            {isEquipLeftHandWeapon && (
              <Input
                className="size-4.5"
                name="left_hand"
                type="radio"
                checked={selectedAttackingZone.LEFT_HAND === zone}
                onChange={() => setSelectedAttackingZone((prev) => ({ ...prev, LEFT_HAND: zone }))}
              />
            )}

            {(isEquipRightHandWeapon || (!isEquipRightHandWeapon && !isEquipLeftHandWeapon)) && (
              <Input
                className="size-4.5"
                name="right_hand"
                type="radio"
                checked={selectedAttackingZone.RIGHT_HAND === zone}
                onChange={() => setSelectedAttackingZone((prev) => ({ ...prev, RIGHT_HAND: zone }))}
              />
            )}

            <p className="text-sm lowercase">hit to the {zone}</p>
          </li>
        ))}
      </ul>
      <ul className="flex w-fit flex-col gap-1">
        <p className="text-center text-blue-500">DEFENSE</p>
        {defenseZoneValues.map((zone, idx) => (
          <li key={idx} className="flex select-none gap-1">
            <Input
              className="size-4.5"
              name="defense"
              type="radio"
              checked={selectedDefenseZone === zone}
              onChange={() => setSelectedDefenseZone(zone)}
            />

            <p onClick={() => setSelectedDefenseZone(zone)} className="text-sm lowercase">
              block {zone}
            </p>
          </li>
        ))}
      </ul>

      <Button
        onClick={() => {
          console.log(selectedAttackingZone);
          console.log(selectedDefenseZone);
        }}
      >
        Turn
      </Button>
    </section>
  );
};
