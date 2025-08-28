import React from 'react';

interface Props {
  characterImage: string;
}

export const HeroTile = ({ characterImage }: Props) => {
  return (
    <>
      <img style={{ imageRendering: 'pixelated' }} src={characterImage} className="absolute left-0 top-0 z-10 size-full" />
    </>
  );
};
