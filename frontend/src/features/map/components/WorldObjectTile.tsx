import { WorldObject } from '@/shared/types';
import React from 'react';

type Props = WorldObject;

export const WorldObjectTile = (props: Props) => {
  const { image } = props;

  return (
    <>
      <img onClick={() => console.log(image)} draggable={false} className="absolute left-0 top-0 z-10 size-full hover:border" src={image} />
    </>
  );
};
