import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';

import { getMapOptions } from '../api/get-map';
import { GameTile } from './GameTile';
import { TileInfo } from './TileInfo';

export const GameMap = () => {
  const [zoom, setZoom] = useState(1);
  const hero = useHero((state) => ({
    posX: state?.data?.tile?.x ?? 0,
    posY: state?.data?.tile?.y ?? 0,
    tileId: state?.data?.tileId ?? '',
    mapId: state?.data?.location?.mapId ?? '',
  }));
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(hero.mapId));

  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  return (
    <section className="flex justify-center gap-2">
      <div>
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
          {map?.tiles?.map((tile) => {
            const hasObject = map?.tiles?.some((t) => t.x === tile.x && t.y === tile.y && t.type === 'OBJECT');

            return (
              <GameTile
                hasObject={hasObject}
                key={tile.id}
                {...tile}
                isMovable={
                  Math.abs(hero.posX - tile.x) <= 1 && Math.abs(hero.posY - tile.y) <= 1 && !(hero.posX === tile.x && hero.posY === tile.y)
                }
                tileHeight={map.tileHeight * zoom}
                tileWidth={map.tileWidth * zoom}
              />
            );
          })}
        </div>
      </div>
      <TileInfo mapId={hero.mapId} tileId={hero.tileId} />
    </section>
  );
};
