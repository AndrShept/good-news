import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

type Props = ComponentProps<'div'>;

export const GroupIcon = ({ className, ...props }: Props) => {
  return (
    <div className={cn('size-8', className)}>
      <img style={{imageRendering: 'pixelated'}} className="size-full " src={'/sprites/icons/group.webp'} alt="gold-image" />
    </div>
  );
};
