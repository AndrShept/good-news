import React from 'react';

interface Props {
  src: string;
}
export const CharacterSprite = ({ src }: Props) => {
  return (
    <div className="my-auto flex h-40 overflow-hidden">
      <img className="object-contain" src={src} alt="hero-image" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};
