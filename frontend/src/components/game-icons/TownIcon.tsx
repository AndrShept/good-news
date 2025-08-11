import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

export const TownIcon = ({ className = 'size-8', ...props }: Props) => {
  return (
    <div className={cn('p-0.5', className)}>
      <img style={{ imageRendering: 'pixelated' }} className="size-full object-contain" src="/sprites/icons/town.png" alt="town-icon" />
    </div>
  );
};
