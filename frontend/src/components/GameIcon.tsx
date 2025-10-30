import { cn } from '@/lib/utils';
import React, { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
  image: string | undefined;
  isPixelate?: boolean;
}
export const GameIcon = ({ image, isPixelate = true, className }: Props) => {
  return (
    <>
      <img
        style={{ imageRendering: isPixelate ? 'pixelated' : undefined }}
        className={cn('size-full shrink-0', className)}
        src={image}
        alt={image?.split('/').at(-1)}
      />
    </>
  );
};
