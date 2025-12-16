import { capitalize, cn, getModifiers } from '@/lib/utils';
import { Armor, OmitModifier } from '@/shared/types';

import { Separator } from './ui/separator';

interface Props {
  armor: Armor;
  coreMaterialModifier?: Partial<OmitModifier>;
}

export const ArmorInfo = ({ armor, coreMaterialModifier }: Props) => {
  const modifiers = getModifiers(armor, coreMaterialModifier ?? {});
  return (
    <section className="flex flex-col gap-2">
      <p className="text-muted-foreground/30">{capitalize(armor.slot)}</p>
      <div className="space-y-1">
        <div>
          <Separator className="mb-2" />

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
      </div>
    </section>
  );
};
