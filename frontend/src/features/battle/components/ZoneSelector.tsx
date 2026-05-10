import { Input } from '@/components/ui/input';
import { BattleShieldZoneType, BattleZoneType, EquipmentSlotType, battleShieldZoneValues, battleZoneValues } from '@/shared/types';
import { useState } from 'react';

interface Props {
  isEquipLeftWeapon: boolean;
  isEquipShield: boolean;
}

export const ZoneSelector = ({ isEquipLeftWeapon, isEquipShield }: Props) => {
  const [selectedAttackingZone, setSelectedAttackingZone] = useState<
    Record<Extract<EquipmentSlotType, 'LEFT_HAND' | 'RIGHT_HAND'>, BattleZoneType>
  >({
    LEFT_HAND: 'CHEST',
    RIGHT_HAND: 'CHEST',
  });
  const [selectedDefenseZone, setSelectedDefenseZone] = useState<BattleZoneType | BattleShieldZoneType>('CHEST');
  const defenseZoneValues = isEquipShield ? battleShieldZoneValues : battleZoneValues;

  return (
    <section className="mx-auto flex flex-col gap-2 md:flex-row">
      <ul className="flex w-fit flex-col gap-1">
        <p className="text-center text-yellow-400">ATTACK</p>
        {battleZoneValues.map((zone) => (
          <li key={zone} className="flex select-none items-center gap-1">
            {isEquipLeftWeapon && (
              <Input
                className="size-4.5"
                name="left_hand"
                type="radio"
                checked={selectedAttackingZone.LEFT_HAND === zone}
                onChange={() => setSelectedAttackingZone((prev) => ({ ...prev, LEFT_HAND: zone }))}
              />
            )}

            <Input
              className="size-4.5"
              name="right_hand"
              type="radio"
              checked={selectedAttackingZone.RIGHT_HAND === zone}
              onChange={() => setSelectedAttackingZone((prev) => ({ ...prev, RIGHT_HAND: zone }))}
            />

            <p onClick={() => setSelectedAttackingZone((prev) => ({ ...prev, RIGHT_HAND: zone }))} className="text-sm lowercase">
              hit to the {zone}
            </p>
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
    </section>
  );
};
