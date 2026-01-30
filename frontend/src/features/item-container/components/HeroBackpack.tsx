import React from 'react';

import { useHeroBackpack } from '../hooks/useHeroBackpack';
import { ItemContainer } from './ItemContainer';
import { ItemContainerSkeleton } from './ItemContainerSkeleton';

export const HeroBackpack = () => {
  const { backpack, isLoading } = useHeroBackpack();
  if (isLoading) return <ItemContainerSkeleton />;
  return <ItemContainer {...backpack!} />;
};
