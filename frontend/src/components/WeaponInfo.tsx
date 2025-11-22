import { cn, modifierChangeName } from '@/lib/utils';
import { Weapon } from '@/shared/types';

import { Separator } from './ui/separator';

type Props = Weapon;

export const WeaponInfo = (props: Props) => {
  const baseModifier = [
    {
      name: modifierChangeName('physDamage'),
      value: props.physDamage,
    },
    {
      name: modifierChangeName('physHitChance'),
      value: props.physHitChance,
    },
    {
      name: modifierChangeName('physCritChance'),
      value: props.physCritChance,
    },
    {
      name: modifierChangeName('physCritPower'),
      value: props.physCritPower,
    },
    {
      name: modifierChangeName('spellDamage'),
      value: props.spellDamage,
    },
    {
      name: modifierChangeName('spellHitChance'),
      value: props.spellHitChance,
    },
    {
      name: modifierChangeName('spellCritChance'),
      value: props.spellCritChance,
    },
    {
      name: modifierChangeName('spellCritPower'),
      value: props.spellCritPower,
    },
  ];
  return (
    <section className="flex flex-col gap-2">
      <div>
        <p className="text-muted-foreground/30">{props.weaponHand.toLocaleLowerCase()}</p>
        <p className="text-muted-foreground/30">{props.weaponType.toLocaleLowerCase()}</p>
      </div>

      <div>
        <Separator className="mb-2" />
        <div className="space-x-1">
          <span className="text-muted-foreground">Damage:</span>
          <span className="text-yellow-300">
            {props.minDamage} - {props.maxDamage}
          </span>
        </div>
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
    </section>
  );
};
