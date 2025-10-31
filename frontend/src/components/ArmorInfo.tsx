import { cn, modifierChangeName } from '@/lib/utils';
import { Armor, RarityType } from '@/shared/types';
import React from 'react';

import { Separator } from './ui/separator';

type Props = Armor;

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
        <p className="text-muted-foreground/30 capitalize">{slot.toLocaleLowerCase()}</p>
      </div>
      <div className="space-y-1">
        <div>
          <h2 className="font-medium text-emerald-500">BASE:</h2>
          <Separator className="my-1" />

          <ul>
            {baseModifier.map((modifier) => {
              if (!modifier.value) return;
              return (
                <li key={modifier.name} className="flex items-center gap-1">
                  <p className={cn('font-medium', modifier.value > 0 ? 'text-green-500' : 'text-red-400')}>
                    {modifier.value > 0 ? '+' : ''}
                    {modifier.value}
                  </p>
                  <p className="text-muted-foreground">{modifier.name}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};
