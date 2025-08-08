import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

type Props = ComponentProps<'div'>;

export const WalkIcon = ({ className, ...props }: Props) => {
  return (
    <div className={cn('size-6', className)}>
      <img style={{ imageRendering: 'pixelated' }} className="size-full" src={'/sprites/icons/walk.webp'} alt="walk-image" />
    </div>
  );
};
