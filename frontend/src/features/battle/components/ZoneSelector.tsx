import { GameIcon } from '@/components/GameIcon';
import { Input } from '@/components/ui/input';
import { imageConfig } from '@/shared/config/image-config';
import { SelectedAttackingZone, SelectedDefenseZone, battleShieldZoneValues, battleZoneValues } from '@/shared/types';
import { useState } from 'react';

import { useBattle } from '../hooks/useBattle';
import { AutoZoneSelectorButton } from './AutoZoneSelectorButton';
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
  const [selectedAttackingZone, setSelectedAttackingZone] = useState<SelectedAttackingZone>(() => {
    if (!isEquipLeftHandWeapon && !isEquipRightHandWeapon)
      return {
        LEFT_HAND: null,
        RIGHT_HAND: 'CHEST',
      };
    return {
      LEFT_HAND: isEquipLeftHandWeapon ? 'CHEST' : null,
      RIGHT_HAND: isEquipRightHandWeapon ? 'CHEST' : null,
    };
  });
  const [selectedDefenseZone, setSelectedDefenseZone] = useState<SelectedDefenseZone>('CHEST');
  return (
    <section className="mx-auto flex h-full w-full flex-col items-center justify-between gap-2">
      <div className="flex flex-col gap-2 text-nowrap md:flex-row">
        <ul className="flex w-fit flex-col gap-1">
          <p className="text-mist-500 text-center">Attack zone</p>
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

              <p className="text-sm lowercase">hit {zone}</p>
            </li>
          ))}
        </ul>
        <ul className="flex w-fit flex-col gap-1">
          <p className="text-center text-slate-500">Block zone</p>
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
      <div className="flex w-full flex-col items-center gap-1">
        <p className="text-mauve-500">
          Round: <span className="text-foreground">{currentRound}</span>
        </p>
        <div className="flex gap-1">
          <GameIcon className="size-6" image={imageConfig.icon.ui.clock} />
          <BattleTimer roundEndsAt={roundEndsAt} lowTime={10} />
        </div>
        <div className="flex w-full justify-center gap-1">
          <AutoZoneSelectorButton
            setSelectedAttackingZone={setSelectedAttackingZone}
            setSelectedDefenseZone={setSelectedDefenseZone}
            isEquipLeftHandWeapon={isEquipLeftHandWeapon}
            isEquipRightHandWeapon={isEquipRightHandWeapon}
            isEquipShield={isEquipShield}
          />
          <TurnButton targetId={targetId} selectedAttackingZone={selectedAttackingZone} selectedDefenseZone={selectedDefenseZone} />
        </div>
      </div>
    </section>
  );
};
