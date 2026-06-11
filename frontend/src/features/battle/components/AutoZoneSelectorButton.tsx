import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectedAttackingZone, SelectedDefenseZone } from '@/shared/battle-types';
import { imageConfig } from '@/shared/config/image-config';
import { getAttackingRandomZone, getDefenseRandomZone } from '@/shared/utils';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useIsMutating } from '@tanstack/react-query';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';

interface Props {
  isEquipLeftHandWeapon: boolean;
  isEquipRightHandWeapon: boolean;
  isEquipShield: boolean;
  setSelectedAttackingZone: Dispatch<SetStateAction<SelectedAttackingZone>>;
  setSelectedDefenseZone: Dispatch<SetStateAction<SelectedDefenseZone>>;
}
export const AutoZoneSelectorButton = ({
  isEquipLeftHandWeapon,
  isEquipRightHandWeapon,
  isEquipShield,
  setSelectedAttackingZone,
  setSelectedDefenseZone,
}: Props) => {
  const isAutoZoneChecked = useGameUIStore((state) => state.isAutoZoneChecked);
  const setIsAutoZoneChecked = useGameUIStore((state) => state.setIsAutoZoneChecked);
  const disabled = !!useIsMutating();
  const onRandom = useCallback(() => {
    const attackingZone = getAttackingRandomZone({ isEquipLeftHandWeapon, isEquipRightHandWeapon });
    const defenseZone = getDefenseRandomZone(isEquipShield);
    setSelectedAttackingZone(attackingZone);
    setSelectedDefenseZone(defenseZone);
  }, [isEquipLeftHandWeapon, isEquipRightHandWeapon, isEquipShield, setSelectedAttackingZone, setSelectedDefenseZone]);

  useEffect(() => {
    if (!disabled && isAutoZoneChecked) {
      onRandom();
    }
  }, [disabled, isAutoZoneChecked, onRandom]);
  return (
    <div className="flex items-center gap-1">
      <Input
        title="auto zone"
        checked={isAutoZoneChecked}
        onChange={(e) => setIsAutoZoneChecked(e.target.checked)}
        className="size-4.5"
        type="checkbox"
      />
      <Button disabled={disabled} onClick={onRandom} variant="outline" size="icon">
        <GameIcon className="size-5" image={imageConfig.icon.ui.random} />
      </Button>
    </div>
  );
};
