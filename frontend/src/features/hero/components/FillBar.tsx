import { cn } from '@/lib/utils';
import React, { useEffect } from 'react';

interface Props {
  value: number;
  maxValue: number;
  color: 'green' | 'blue' | 'violet';
}

export const FillBar = ({ value, maxValue, color }: Props) => {
  const lowPercentHealth = maxValue * 0.3;

  return (
    <div className="relative border bg-secondary/40 rounded w-full  h-4">
      <div
        style={{ width: `${(value / maxValue) * 100}%` }}
        className={cn(
          ' h-full transition-all duration-300 ease-in-out rounded ',
          {
            'bg-gradient-to-b from-red-500  to-red-900':
              value <= lowPercentHealth && color === 'green',
            'bg-green-700 ':
              color === 'green' && value > lowPercentHealth,
            'bg-blue-600 ': color === 'blue',
            'bg-violet-600':
              color === 'violet',
          },
        )}
      />
      <div className="absolute w-full -top-[0px] text-center">
        <p className=" text-[11px] font-light">
          {color === 'violet' && 'EXP'} {value}/{maxValue}
        </p>
      </div>
    </div>
  );
};
