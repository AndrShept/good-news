import React from 'react';

interface Props {
  src: string;
}
export const CharacterSprite = ({ src }: Props) => {
  return (
    <div className="flex h-[250px] w-[150px] shrink-0 items-center justify-center">
      <img className="size-full object-contain" src={src} alt="hero-image" style={{ imageRendering: 'pixelated' }} />
    </div>
  );
};
