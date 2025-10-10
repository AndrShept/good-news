import { cn, rarityConfig } from '@/lib/utils';
import { RarityType } from '@/shared/types';
import React, { PropsWithChildren } from 'react';

export const GameItemSlot = ({ children, rarity }: PropsWithChildren<{ rarity?: RarityType }>) => {
  return <article className={cn('group relative size-12 border', rarity && rarityConfig[rarity].border)}>{children}</article>;
};
