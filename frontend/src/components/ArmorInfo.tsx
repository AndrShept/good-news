import { modifierChangeName } from '@/lib/utils';
import { Armor, RarityType } from '@/shared/types';
import React from 'react';

import { Separator } from './ui/separator';

type Props = Armor 

export const ArmorInfo = ({ defense, evasion, magicResistance, slot }: Props) => {
  const baseModifier = [
    {
      name: modifierChangeName('defense'),
      value: defense,
    },
    {
      name: modifierChangeName('evasion'),
      value: evasion,
    },
    {
      name: modifierChangeName('magicResistance'),
      value: magicResistance,
    },
  ];
  return (
    <section className="flex flex-col gap-2">
      <div>
        <p className="text-muted-foreground/30">{slot}</p>
      </div>
      <div className="space-y-1">
        <div>
          <h2 className="font-medium text-yellow-400">BASE:</h2>
          <Separator />

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
      </div>
    </section>
  );
};
