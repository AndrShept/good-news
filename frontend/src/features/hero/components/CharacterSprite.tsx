import React from 'react';

interface Props {
  src: string;
}
export const CharacterSprite = ({ src }: Props) => {
  return (
    <div className="flex overflow-hidden">
      <img className="scale-120 size-full object-contain" src={src} alt="hero-image" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};
