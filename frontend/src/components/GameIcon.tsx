import { cn } from '@/lib/utils';
import React, { ComponentProps, memo } from 'react';

interface Props extends ComponentProps<'div'> {
  image: string | undefined;
  isPixelate?: boolean;
}
export const GameIcon = memo(({ image, isPixelate = true, className }: Props) => {
  return (
    <div className={cn('size-6 shrink-0', className)}>
      <img
        style={{ imageRendering: isPixelate ? 'pixelated' : undefined }}
        className={cn('size-full ', className)}
        src={image}
        alt={image?.split('/').at(-1)}
      />
    </div>
  );
});
