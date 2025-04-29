import { cn } from '@/lib/utils';
import React from 'react';

interface HeroAvatarProps {
  src: string | undefined;
  isSelected?: boolean;
  classname?: string;
  onClick?: () => void;
}

export const HeroAvatar = ({ src, isSelected = false, classname, onClick }: HeroAvatarProps) => {
  return (
    <article
      onClick={onClick}
      className={cn('relative size-12 rounded-full border ', classname, {
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
