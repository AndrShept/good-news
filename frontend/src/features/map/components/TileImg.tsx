import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
  image: string;
  isPixelate?: boolean;
}
export const TileImg = ({ image, isPixelate = true, className, ...props }: Props) => {
  return (
    <img
      {...props}
      draggable={false}
      style={{
  
        imageRendering: isPixelate ? 'pixelated' : 'auto',
      }}
      className={cn('size-full drop-shadow-md/40', className)}
      src={image}
      alt="tile-image"
    />
  );
};
