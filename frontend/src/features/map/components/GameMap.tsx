import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';

import { getMapOptions } from '../api/get-map';
import { useCenteredVirtualizer } from '../hooks/useCenteredVirtualizer';
import { GameTile } from './GameTile';
import { ScrollMap } from './ScrollMap';
import { TileInfo } from './TileInfo';

export const GameMap = () => {
  const hero = useHero((state) => ({
    posX: state?.data?.tile?.x ?? 0,
    posY: state?.data?.tile?.y ?? 0,
    tileId: state?.data?.tileId ?? '',
    mapId: state?.data?.location?.mapId ?? '',
    townId: state?.data?.location?.townId ?? '',
  }));
  const { data: map, isLoading, isError, error } = useQuery(getMapOptions(hero.mapId, hero.townId));
  const tileWidth = map?.tileWidth ?? 32;
  const tileHeight = map?.tileHeight ?? 32;
  const mapHeight = map?.height ?? 0;
  const mapWidth = map?.width ?? 0;
  const { colVirtualizer, parentRef, rowVirtualizer } = useCenteredVirtualizer({
    hero,
    map,
    tileHeight,
    tileWidth,
  });

  if (isLoading) return <p>LOADING MAP...</p>;
  if (isError) return <p>{error.message}</p>;
  if (!map) return <p>NO MAP FOUND</p>;

  return (
    <section className="flex flex-col gap-2">
      <ScrollMap
        posX={hero.posX}
        posY={hero.posY}
        colVirtualizer={colVirtualizer}
        rowVirtualizer={rowVirtualizer}
        parentRef={parentRef}
        tileHeight={tileHeight}
        tileWidth={tileWidth}
      />
      <div className="flex justify-center gap-2">
        <div ref={parentRef} className="overflow-auto" style={{ height: 400, width: 600 }}>
          <ul
            style={{
              position: 'relative',
              width: mapWidth,
              height: mapHeight,
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualRow) =>
              colVirtualizer.getVirtualItems().map((virtualCol) => {
                const tile = map.tilesGrid![virtualRow.index][virtualCol.index];
                if (!tile) return;

                const isMovable =
                  Math.abs(virtualCol.index - hero.posX) <= 1 &&
                  Math.abs(virtualRow.index - hero.posY) <= 1 &&
                  !(virtualCol.index === hero.posX && virtualRow.index === hero.posY);

                return (
                  <div
                    key={tile.id}
                    style={{
                      position: 'absolute',
                      top: virtualRow.start,
                      left: virtualCol.start,
                      width: virtualCol.size,
                      height: virtualRow.size,
                    }}
                  >
                    <GameTile {...tile} isMovable={isMovable} />
                  </div>
                );
              }),
            )}
          </ul>
        </div>
        <TileInfo mapId={hero.mapId} posX={hero.posX} posY={hero.posY} tileId={hero.tileId} />
      </div>
    </section>
  );
};
