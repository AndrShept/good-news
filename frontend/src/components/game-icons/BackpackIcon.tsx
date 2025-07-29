import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

type Props = ComponentProps<'div'>;

export const BackpackIcon = ({ className = 'size-7.5', ...props }: Props) => {
  return (
    <div className={cn('p-0.5', className)}>
      <img style={{ imageRendering: 'pixelated' }} className="size-full object-contain" src="/sprites/icons/backpack1.png" alt="shield-icon" />
    </div>
  );
}
