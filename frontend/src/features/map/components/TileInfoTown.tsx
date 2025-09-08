import { Town } from '@/shared/types';
import React from 'react';

import { TileImg } from './TileImg';

type Props = Town;

export const TileInfoTown = ({ name, image }: Props) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-center">Town name: {name}</h2>
      <div className="max-w-[300px]">
        <TileImg image={image} />
      </div>
    </div>
  );
};
