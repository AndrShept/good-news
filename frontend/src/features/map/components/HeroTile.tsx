import React from 'react';

import { TileImg } from './TileImg';

interface Props {
  characterImage: string;
}

export const HeroTile = ({ characterImage }: Props) => {
  return (
    <>
      <TileImg image={characterImage} className="absolute left-0 top-0" />
    </>
  );
};
