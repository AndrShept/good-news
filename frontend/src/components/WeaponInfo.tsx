import { modifierChangeName } from '@/lib/utils';
import { RarityType, Weapon } from '@/shared/types';
import React from 'react';

import { Separator } from './ui/separator';

interface Props extends Weapon {
  rarity: RarityType;
}

export const WeaponInfo = ({
  minDamage,
  maxDamage,
  physDamage,
  physHitChance,
  physCritChance,
  physCritPower,
  spellDamage,
  spellHitChance,
  spellCritChance,
  spellCritPower,
  weaponType,
  weaponHand,

}: Props) => {
  const baseModifier = [
    {
      name: modifierChangeName('physDamage'),
      value: physDamage,
    },
    {
      name: modifierChangeName('physHitChance'),
      value: physHitChance,
    },
    {
      name: modifierChangeName('physCritChance'),
      value: physCritChance,
    },
    {
      name: modifierChangeName('physCritPower'),
      value: physCritPower,
    },
    {
      name: modifierChangeName('spellDamage'),
      value: spellDamage,
    },
    {
      name: modifierChangeName('spellHitChance'),
      value: spellHitChance,
    },
    {
      name: modifierChangeName('spellCritChance'),
      value: spellCritChance,
    },
    {
      name: modifierChangeName('spellCritPower'),
      value: spellCritPower,
    },
  ];
  return (
    <section className=" flex flex-col gap-2">
      <div>
        <p className="text-muted-foreground/30">{weaponHand}</p>
        <p className="text-muted-foreground/30">{weaponType}</p>
      </div>

      <div>
        <h2 className="font-medium text-yellow-400">BASE:</h2>
        <Separator />
        <div className="mt-1 space-x-1">
          <span className="text-muted-foreground">Damage:</span>
          <span>
            {minDamage} - {maxDamage}
          </span>
        </div>
        <ul>
          {baseModifier.map((modifier) => {
            if (!modifier.value) return;
            return (
              <li key={modifier.name} className="flex items-center gap-1">
                <p className="text-green-500">+{modifier.value}</p>
                <p className="text-muted-foreground">{modifier.name}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-1 space-x-1">
        <h2 className="font-medium text-yellow-400">MODIFIER:</h2>
        <Separator />
      </div>
    </section>
  );
};
