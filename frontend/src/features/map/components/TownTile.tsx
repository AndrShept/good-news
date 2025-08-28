import React from 'react';

interface Props {
  image: string;
}

export const TownTile = ({ image }: Props) => {
  return (
    <>
      <img style={{ imageRendering: 'pixelated' }} src={image} className="absolute left-0 top-0 z-10" />
    </>
  );
};
