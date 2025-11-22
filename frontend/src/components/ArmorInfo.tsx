import { capitalize, cn, modifierChangeName } from '@/lib/utils';
import { Armor } from '@/shared/types';

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
      <p className="text-muted-foreground/30">{capitalize(slot)}</p>
      <div className="space-y-1">
        <div>
          <Separator className="mb-2" />

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
