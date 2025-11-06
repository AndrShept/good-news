import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

interface Props extends ComponentProps<'img'> {
  image: string | undefined;
  isPixelate?: boolean;
}

export const GameItemImg = memo(({ image, isPixelate = true, className, ...props }: Props) => {
  return (
    <>
      <img
        style={{ imageRendering: isPixelate ? 'pixelated' : undefined }}
        className={cn('size-full object-contain opacity-85 group-hover:opacity-100', className)}
        src={image}
        alt={image?.split('/').at(-1)}
      />
    </>
  );
});
