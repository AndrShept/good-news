import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

type Props = ComponentProps<'div'>;

export const GoldIcon = ({ className, ...props }: Props) => {
  return (
    <div className={cn('size-6', className)}>
   <img className="size-full" src={'/sprites/icons/gold.png'} alt="gold-image" />
    </div>
  );
}
