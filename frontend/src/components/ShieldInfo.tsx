import { capitalize, cn, getModifiers } from '@/lib/utils';
import { Armor, OmitModifier, Shield } from '@/shared/types';

import { Separator } from './ui/separator';

interface Props {
  shield: Shield;
  coreMaterialModifier?: Partial<OmitModifier>;
}

export const ShieldInfo = ({ shield, coreMaterialModifier }: Props) => {
  const modifiers = getModifiers(shield, coreMaterialModifier ?? {});
  return (
    <section className="flex flex-col gap-2">
      <div className="space-y-1">
        <div>
          <Separator className="mb-2 mt-2" />

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
