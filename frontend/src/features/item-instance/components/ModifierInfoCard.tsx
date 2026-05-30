import { cn, getModifiers } from '@/lib/utils';
import { Modifier } from '@/shared/types';
import { sumAllModifier } from '@/shared/utils';

interface Props {
  modifiers: Array<Partial<Modifier> | undefined>;
}
export const ModifierInfoCard = ({ modifiers }: Props) => {
  const sumModifier = sumAllModifier(...modifiers);
  const renderModifiers = getModifiers(sumModifier);

  return (
    <ul className="mt-1 flex flex-col items-center">
      {renderModifiers
        .sort((a, b) => a.sortNumber - b.sortNumber)
        .map((modifier) => {
          if (!modifier.value) return;
          return (
            <li key={modifier.name} className="flex items-center gap-1">
              <p>{modifier.name}:</p>
              <p className={cn('', modifier.value > 0 ? 'text-green-500' : 'text-red-400')}>
                {modifier.value > 0 ? '+' : ''}
                {modifier.value}
              </p>
            </li>
          );
        })}
    </ul>
  );
};
