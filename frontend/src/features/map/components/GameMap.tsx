import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { getMapOptions } from '../api/get-map';
import { GameTile } from './GameTile';

export const Map = () => {
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions('SOLMERE'));
  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  return (
    <section>
      <div
        style={{
          width: map?.width,
          height: map?.height,
        }}
        className="relative mx-auto"
      >
        {map?.tiles?.map((tile) => <GameTile key={tile.id} {...tile} tileHeight={map.tileHeight} tileWidth={map.tileWidth} />)}
      </div>
    </section>
  );
};
