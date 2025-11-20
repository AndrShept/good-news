import { rarityConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { RarityType } from '@/shared/types';
import React, { PropsWithChildren } from 'react';

export const GameItemSlot = ({ children }: PropsWithChildren<{ rarity?: RarityType }>) => {
  return <div className={cn('hover:saturate-120 hover:border-primary/20 group relative size-12 border')}>{children}</div>;
};
