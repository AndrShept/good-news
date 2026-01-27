import { rarityConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { RarityType } from '@/shared/types';
import React, { ComponentProps, ReactNode } from 'react';

interface Props extends ComponentProps<'div'> {
  children?: ReactNode;
}

export const GameItemSlot = ({ children, className, ...props }: Props) => {
  return <div className={cn('hover:saturate-120 hover:border-primary/20 group relative size-12 border', className)}>{children}</div>;
};
