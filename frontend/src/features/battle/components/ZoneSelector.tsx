import { GameIcon } from '@/components/GameIcon';
import { Input } from '@/components/ui/input';
import { imageConfig } from '@/shared/config/image-config';
import { SelectedAttackingZone, SelectedDefenseZone, battleShieldZoneValues, battleZoneValues } from '@/shared/types';
import { useState } from 'react';

import { BattleTimer } from './BattleTimer';
import { TurnButton } from './TurnButton';

interface Props {
  isEquipLeftHandWeapon: boolean;
  isEquipRightHandWeapon: boolean;
  isEquipShield: boolean;
  targetId: string;
  currentRound: number;
  roundEndsAt: number;
}

export const ZoneSelector = ({
  isEquipLeftHandWeapon,
  isEquipRightHandWeapon,
  isEquipShield,
  targetId,
  currentRound,
  roundEndsAt,
}: Props) => {
  const defenseZoneValues = isEquipShield ? battleShieldZoneValues : battleZoneValues;
  const [selectedAttackingZone, setSelectedAttackingZone] = useState<SelectedAttackingZone>({
    LEFT_HAND: isEquipLeftHandWeapon ? 'CHEST' : null,
    RIGHT_HAND: isEquipRightHandWeapon ? 'CHEST' : null,
  });
  const [selectedDefenseZone, setSelectedDefenseZone] = useState<SelectedDefenseZone>('CHEST');
  return (
    <section className="mx-auto flex h-full flex-col justify-between gap-2">
      <div className="flex flex-col gap-2 text-nowrap md:flex-row">
        <ul className="flex w-fit flex-col gap-1">
          <p className="text-center text-yellow-400">ATTACK</p>
          {battleZoneValues.map((zone) => (
            <li key={zone} className="flex select-none items-center gap-1">
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
                onChange={() => setSelectedDefenseZone(zone as SelectedDefenseZone)}
              />

              <p onClick={() => setSelectedDefenseZone(zone as SelectedDefenseZone)} className="text-sm lowercase">
                block {zone}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-1">
        <div className="mx-auto flex items-center gap-1">
          <p>Round: {currentRound}</p>
          <GameIcon className="size-6" image={imageConfig.icon.ui.clock} />
          <BattleTimer roundEndsAt={roundEndsAt} />
        </div>
        <TurnButton targetId={targetId} selectedAttackingZone={selectedAttackingZone} selectedDefenseZone={selectedDefenseZone} />
      </div>
    </section>
  );
};
