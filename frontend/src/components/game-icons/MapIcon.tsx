import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

type Props = ComponentProps<'div'>;

export const MapIcon = ({ className, ...props }: Props) => {
  return (
    <div className={cn('size-7', className)}>
      <img style={{imageRendering: 'pixelated'}} className="size-full " src={'/sprites/icons/map.png'} alt="map-image" />
    </div>
  );
};
