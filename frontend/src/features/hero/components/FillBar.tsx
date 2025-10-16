import { cn } from '@/lib/utils';

interface Props {
  value: number;
  maxValue: number;
  type: 'health' | 'mana' | 'exp';
}

export const FillBar = ({ value, maxValue, type }: Props) => {
  const lowPercentHealth = maxValue * 0.3;

  return (
    <div className="bg-secondary/40 relative h-4 w-full rounded border overflow-hidden">
      <div
        style={{ width: `${(value / maxValue) * 100}%` }}
        className={cn('h-full  transition-all duration-300 ease-in-out', {
          'bg-gradient-to-b from-red-500 to-red-900': value <= lowPercentHealth && type === 'health',
          'bg-green-700': type === 'health' && value > lowPercentHealth,
          'bg-blue-600': type === 'mana',
          'bg-violet-600': type === 'exp',
        })}
      />
      <div className="absolute -top-[0px] w-full text-center">
        <p className="text-[11px] font-light">
          {type === 'exp' && 'EXP'} {value}/{maxValue}
        </p>
      </div>
    </div>
  );
};
