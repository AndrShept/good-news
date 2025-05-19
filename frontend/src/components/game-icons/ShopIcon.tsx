import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

type Props = ComponentProps<'div'>;

export const ShopIcon = ({ className = 'size-8', ...props }: Props) => {
  return (
    <div className={cn('p-0.5', className)}>
      <img style={{ imageRendering: 'pixelated' }} className="size-full object-contain" src="/sprites/new/shop.png" alt="shield-icon" />
    </div>
  );
};
