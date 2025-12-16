import { cn, getModifiers } from '@/lib/utils';
import { OmitModifier, Weapon } from '@/shared/types';

import { Separator } from './ui/separator';

interface Props {
  weapon: Weapon;
  coreMaterialModifier?: Partial<OmitModifier>;
}

export const WeaponInfo = ({ weapon, coreMaterialModifier }: Props) => {
  const modifiers = getModifiers(weapon, coreMaterialModifier ?? {} );

  return (
    <section className="flex flex-col gap-2">
      <div>
        <p className="text-muted-foreground/30">{weapon.weaponHand.toLocaleLowerCase()}</p>
        <p className="text-muted-foreground/30">{weapon.weaponType.toLocaleLowerCase()}</p>
      </div>

      <div>
        <Separator className="mb-2" />
        <div className="space-x-1">
          <span className="text-muted-foreground">Damage:</span>
          <span className="text-yellow-300">
            {weapon.minDamage} - {weapon.maxDamage}
          </span>
        </div>
        <ul>
          {modifiers.map((modifier) => {
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
