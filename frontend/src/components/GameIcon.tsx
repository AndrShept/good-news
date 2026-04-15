import { cn } from '@/lib/utils';
import  { ComponentProps, memo } from 'react';

interface Props extends ComponentProps<'div'> {
  image: string | undefined;
  isPixelate?: boolean;
}
export const GameIcon = memo(function GameIcon({ image, isPixelate = true, className }: Props) {
  return (
    <div
      style={{
        imageRendering: isPixelate ? 'pixelated' : undefined,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
      }}
      className={cn('size-7 shrink-0', className)}
    >
      {/* <img
        style={{ imageRendering: isPixelate ? 'pixelated' : undefined }}
        className={cn('size-full will-change-transform', className)}
        src={image}
        alt={image}
      /> */}
    </div>
  );
});
