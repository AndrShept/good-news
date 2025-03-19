import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type VariantProps, cva } from 'class-variance-authority';
import React, { ComponentProps } from 'react';

const avatarVariants = cva('border', {
  variants: {
    size: {
      sm: 'size-8',
      md: 'size-10',
      lg: 'size-13',
    },
  },

  defaultVariants: {
    size: 'sm',
  },
});

type Props = ComponentProps<'span'> &
  VariantProps<typeof avatarVariants> & {
    url: string | undefined;
  };

export const UserAvatar = ({ url, size, className, ...props }: Props) => {
  return (
    <Avatar {...props} className={avatarVariants({ size, className })}>
      <AvatarImage src={url} />
      <AvatarFallback></AvatarFallback>
    </Avatar>
  );
};
