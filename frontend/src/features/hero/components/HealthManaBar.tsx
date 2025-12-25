import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

import { useHero } from '../hooks/useHero';
import { FillBar } from './FillBar';

type Props = ComponentProps<'section'>;

export const HealthManaBar = ({ className, ...props }: Props) => {
  const { currentHealth, currentMana, maxHealth, maxMana } = useHero((data) => ({
    currentHealth: data?.currentHealth ?? 0,
    maxHealth: data?.maxHealth ?? 0,
    currentMana: data?.currentMana ?? 0,
    maxMana: data?.maxMana ?? 0,
  }));
  return (
    <section className={cn('flex min-w-[100px] flex-col gap-0.5', className)}>
      <FillBar type="health" value={currentHealth} maxValue={maxHealth} />
      <FillBar type="mana" value={currentMana} maxValue={maxMana} />
    </section>
  );
};
