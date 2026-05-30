import { GameIcon } from '@/components/GameIcon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { imageConfig } from '@/shared/config/image-config';
import { SelectedAttackingZone, SelectedDefenseZone } from '@/shared/types';
import { getAttackingRandomZone, getDefenseRandomZone } from '@/shared/utils';
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
  const [isChecked, setIsChecked] = useState(false);
  const disabled = !!useIsMutating();
  const onRandom = useCallback(() => {
    const attackingZone = getAttackingRandomZone({ isEquipLeftHandWeapon, isEquipRightHandWeapon });
    const defenseZone = getDefenseRandomZone(isEquipShield);
    setSelectedAttackingZone(attackingZone);
    setSelectedDefenseZone(defenseZone);
  }, [isEquipLeftHandWeapon, isEquipRightHandWeapon, isEquipShield, setSelectedAttackingZone, setSelectedDefenseZone]);

  useEffect(() => {
    if (isChecked) {
      onRandom();
    }
  }, [disabled]);
  return (
    <div className="flex items-center gap-1">
      <Input checked={isChecked} onChange={(e) => setIsChecked(e.target.checked)} className="size-4.5" type="checkbox" />
      <Button disabled={disabled} onClick={onRandom} variant="outline" size="icon">
        <GameIcon className="size-4" image={imageConfig.icon.ui.refresh} />
      </Button>
    </div>
  );
};
