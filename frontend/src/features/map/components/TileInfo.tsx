import { useHero } from '@/features/hero/hooks/useHero';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import { getTileOptions } from '../api/get-tile';
import { TileActions } from './TileActions';
import { TileInfoTown } from './TileInfoTown';

export const TileInfo = () => {
  const tileId = useHero((state) => state?.data?.tileId ?? '');
  const { data: tile, isLoading } = useQuery(getTileOptions(tileId));
  const isTown = !!tile?.townId;

  if (isLoading) return <div>loading tile ...</div>;
  return (
    <section className="flex flex-1 flex-col items-center p-2 gap-2">
      {isTown && <TileInfoTown {...tile.town!} />}
      <TileActions isTown={isTown} />
    </section>
  );
};
