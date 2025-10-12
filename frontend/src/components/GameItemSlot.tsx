import { rarityConfig } from '@/lib/config';
import { cn } from '@/lib/utils';
import { RarityType } from '@/shared/types';
import React, { PropsWithChildren } from 'react';

export const GameItemSlot = ({ children }: PropsWithChildren<{ rarity?: RarityType }>) => {
  return <article className={cn('group relative size-12 border')}>{children}</article>;
};
