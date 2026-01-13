import { cn, getModifiers } from '@/lib/utils';

interface Props {
  modifiers: ReturnType<typeof getModifiers>;
}
export const ModifierInfoCard = ({ modifiers }: Props) => {
  return (
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
  );
};
