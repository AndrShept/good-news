import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
  image: string;
  isPixelate?: boolean;
}

export const TileImg = ({ image, isPixelate = true, className, ...props }: Props) => {
  return (
   
      <img
        draggable={false}
        style={isPixelate ? { imageRendering: 'pixelated' } : undefined}
        className={cn('size-full', className)}
        src={image}
        alt="tile-image"
      />
   
  );
};
