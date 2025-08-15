import React from 'react';

interface Props {
  image: number;
}

export const TileImg = ({ image }: Props) => {
  return (
    <>
      {' '}
      <img
        draggable={false}
        style={{ imageRendering: 'pixelated' }}
        className=" size-full"
        src={`/sprites/map/solmer-image/${image.toString().padStart(3, '0')}.png`}
      />
    </>
  );
};
