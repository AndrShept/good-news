import React from 'react';
import { useHeroBackpack } from '../hooks/useHeroBackpack';
import { ItemContainer } from './ItemContainer';

export const HeroBackpack = () => {
  const { backpack, isLoading } = useHeroBackpack();
  if(isLoading) return 'dasda'
  return <ItemContainer  {...backpack!}  />;
};
