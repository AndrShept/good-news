import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { getMapOptions } from '../api/get-map';
import { GameTile } from './GameTile';

export const GameMap = () => {
  const mapId = useHero((state) => state?.data?.location?.mapId ?? '');
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(mapId));
  const [zoom, setZoom] = useState(1);
  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  return (
    <section>
      <div className="mb-2 flex gap-2">
        <button onClick={() => setZoom((z) => z * 1.2)}>+</button>
        <button onClick={() => setZoom((z) => z / 1.2)}>-</button>
        <button onClick={() => setZoom(1)}>Reset</button>
      </div>
      <div
        style={{
          width: map?.width ?? 0 * zoom,
          height: map?.height ?? 0 * zoom,
        }}
        className="relative mx-auto"
      >
        {map?.tiles?.map((tile) => (
          <GameTile key={tile.id} {...tile} tileHeight={map.tileHeight * zoom} tileWidth={map.tileWidth * zoom} />
        ))}
      </div>
    </section>
  );
};
