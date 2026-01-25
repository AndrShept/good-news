import { cn, getModifiers } from '@/lib/utils';
import { OmitModifier } from '@/shared/types';

interface Props {
  modifiersArgs: Array<Partial<OmitModifier> | undefined>;
}
export const ModifierInfoCard = ({ modifiersArgs }: Props) => {
  const modifiers = getModifiers(...modifiersArgs);

  return (
    <ul className="mt-1 flex flex-col items-center">
      {modifiers.map((modifier) => {
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
