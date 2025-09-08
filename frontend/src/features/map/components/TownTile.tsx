import React from 'react';

import { TileImg } from './TileImg';

interface Props {
  image: string;
}

export const TownTile = ({ image }: Props) => {
  return (
    <>
      <TileImg image={image} className="absolute left-0 top-0" />
    </>
  );
};
