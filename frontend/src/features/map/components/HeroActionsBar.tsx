import { Location } from '@/shared/types';
import React from 'react';

import { EnterTownButton } from './EnterTownButton';

interface Props {
  isHeroOnTownTile: boolean | undefined;
  heroesAtHeroPos: Location[] | undefined;
}

export const HeroActionsBar = ({ isHeroOnTownTile, heroesAtHeroPos }: Props) => {
  return <div>{
    
    isHeroOnTownTile && <EnterTownButton />
  }</div>;
};
