import { cn } from '@/lib/utils';
import { ComponentProps, memo } from 'react';

export interface TintColor {
  color: [number, number, number];
  brightness?: number;
  saturate?: number;
  contrast?: number;
}

interface Props extends Omit<ComponentProps<'img'>, 'src'> {
  image: string | undefined;
  tintColor: TintColor | null | undefined;
  isPixelate?: boolean;
}

export const GameItemImg = memo(({ image, tintColor, isPixelate = true, className, ...props }: Props) => {
  const filter = tintColor ? buildTintFilter(tintColor.color) : undefined;
  return (
    <img
      {...props}
      src={image}
      alt={image}
      style={{
        imageRendering: isPixelate ? 'pixelated' : undefined,
        filter: tintColor
          ? `${filter} saturate(${tintColor.saturate ?? 1}) brightness(${tintColor.brightness ?? 1}) contrast(${tintColor.contrast ?? 1})`
          : undefined,
      }}
      className={cn('size-full select-none object-contain opacity-85 group-hover:opacity-100', className)}
    />
  );
});

function buildTintFilter([r, g, b]: [number, number, number]): string {
  const rm = r / 255;
  const gm = g / 255;
  const bm = b / 255;

  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg'><filter id='t'><feColorMatrix type='matrix' values='${rm} 0 0 0 0  0 ${gm} 0 0 0  0 0 ${bm} 0 0  0 0 0 1 0'/></filter></svg>#t")`;
}
