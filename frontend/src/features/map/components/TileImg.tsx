import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
  image: string;
  isPixelate?: boolean;
}
export const TileImg = ({ image, isPixelate = true, className, ...props }: Props) => {
  console.log('@@@@' , image)
  return (
    <img
      draggable={false}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        imageRendering: isPixelate ? 'pixelated' : 'auto',
      }}
      className={cn('size-full', className)}
      src={image}
      alt="tile-image"
    />
  );
};
