import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import React, { ComponentProps } from 'react';

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

interface HeroAvatarProps extends VariantProps<typeof avatarVariants>, ComponentProps<'article'> {
  src: string;
  isSelected?: boolean;
  setAvatar?: () => void;
}

export const HeroAvatar = ({ src, isSelected = false, setAvatar, className, size, ...props }: HeroAvatarProps) => {
  console.log('RENDER');
  return (
    <article
      onClick={setAvatar}
      className={cn('shrink-0', avatarVariants({ className, size }), {
        'border-primary opacity-100 ring-1 hover:opacity-100': isSelected,
      })}
    >
      <img
        draggable={false}
        className={cn(
          'size-full rounded-full object-cover',

          {},
        )}
        src={src}
        alt="avatar-image"
      />
    </article>
  );
};
