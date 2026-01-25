import { TEquipInfo } from '@/shared/types';
import React from 'react';

interface Props {
  equipInfo: TEquipInfo | undefined;
  minDamage: number | undefined;
  maxDamage: number | undefined;
}
export const EquipInfo = ({ equipInfo, maxDamage, minDamage }: Props) => {
  return (
    <>
      {equipInfo?.weaponType && (
        <div>
          <span>type:</span> <span>{equipInfo?.weaponType?.toLowerCase()}</span>
        </div>
      )}
      {equipInfo?.weaponHand && (
        <div>
          <span>
            weapon-hand: <span>{equipInfo?.weaponHand?.toLowerCase()}</span>
          </span>
        </div>
      )}
      {equipInfo?.armorCategory && (
        <div>
          <span>class:</span>
          <span> {equipInfo?.armorCategory?.toLowerCase()}</span>
        </div>
      )}
      {minDamage && (
        <div>
          damage: <span>{minDamage}</span> - <span>{maxDamage}</span>
        </div>
      )}
    </>
  );
};
