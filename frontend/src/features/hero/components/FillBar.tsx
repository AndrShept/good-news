import { useSocket } from '@/hooks/useSocket';
import { cn } from '@/lib/utils';
import { useQueryClient } from '@tanstack/react-query';
import React, { memo, useEffect } from 'react';

import { getHeroOptions } from '../api/get-hero';
import { useHero } from '../hooks/useHero';

interface Props {
  value: number;
  maxValue: number;
  type: 'health' | 'mana' | 'exp';
}

export const FillBar = memo(({ value, maxValue, type }: Props) => {
  const lowPercentHealth = maxValue * 0.3;
  const { socket } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (value < maxValue && type === 'health') {
      socket?.emit('regen', value);
    }
    const socketListener = (data) => {
      queryClient.setQueryData(getHeroOptions().queryKey, (oldData) => {
        if (!oldData || !oldData.data) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            currentHealth: oldData.data.currentHealth + data,
          },
        };
      });
    };
    socket?.on(type, socketListener);
    return () => {
      socket?.off(type, socketListener);
    };
  }, [maxValue, socket, value]);

  return (
    <div className="bg-secondary/40 relative h-4 w-full rounded border">
      <div
        style={{ width: `${(value / maxValue) * 100}%` }}
        className={cn('h-full rounded transition-all duration-300 ease-in-out', {
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
})
