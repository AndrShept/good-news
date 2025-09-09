import { memo } from 'react';

import { useMap } from '../hooks/useMap';
import { TileActions } from './TileActions';
import { TileImg } from './TileImg';
import { TileInfoTown } from './TileInfoTown';

type Props = {
  tileId: string;
  mapId: string;
};

export const TileInfo = memo(({ mapId, tileId }: Props) => {
  const tile = useMap({ mapId, select: (state) => state?.tiles?.find((t) => t.id === tileId) });
  const isTown = !!tile?.townId;
  const isTIle = !!tile?.id && !isTown;
  console.log('TILE-INFO RENDER');

  return (
    <section className="flex flex-col items-center gap-2 p-2">
      {isTIle && (
        <div className="w-full max-w-[300px]">
          <TileImg image={`/sprites/map/solmer-image/${tile.image.toString().padStart(3, '0')}.png`} />
        </div>
      )}
      {isTown && <TileInfoTown {...tile.town!} />}
      <TileActions isTown={isTown} tileId={tileId} />
    </section>
  );
});
