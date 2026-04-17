import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import React, { ComponentProps, memo } from 'react';

const avatarVariants = cva('relative rounded-full border', {
  variants: {
    size: {
      xs: 'size-6',
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-12',
      xl: 'size-14',
    },
    variant: {},
  },
  defaultVariants: {
    size: 'lg',
  },
});

interface Props extends VariantProps<typeof avatarVariants>, ComponentProps<'div'> {
  src: string;
  isSelected?: boolean;
  setAvatar?: (imgae: string) => void;
}

export const GameAvatar = memo(({ src, isSelected = false, setAvatar, className, size, ...props }: Props) => {
  return (
    <div
      draggable={false}
      onClick={() => setAvatar?.(src)}
      className={cn('size-full shrink-0 select-none rounded-full object-cover', avatarVariants({ className, size }), {
        'border-primary opacity-100 ring-1 hover:opacity-100': isSelected,
      })}
      style={{
        backgroundImage: `url(${src})`,
        backgroundSize: 'cover',
      }}
    />
  );
});
