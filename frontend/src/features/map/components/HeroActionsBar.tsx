import { Separator } from '@/components/ui/separator';
import { useHeroActions } from '@/features/hero/hooks/useHeroActions';
import { StateType, TMap, TileType } from '@/shared/types';
import { memo } from 'react';

import { GatherResourceButton } from './GatherResourceButton';
import { TravelButton } from './TravelButton';

interface Props {
  map: TMap | undefined;
  heroPosX: number;
  heroPosY: number;
  state: StateType;
}

export const HeroActionsBar = memo(({ heroPosX, heroPosY, map, state }: Props) => {
  const { entranceTile, placeTile, gatheringTiles } = useHeroActions({
    heroPosX,
    heroPosY,
    map,
  });
  const entranceId = entranceTile?.id;
  const placeId = placeTile?.id;
  const image = entranceTile ? entranceTile.image : placeTile?.image;

  return (
    <>
      {(entranceTile || placeTile) && (
        <TravelButton image={image ?? ''} placeId={placeId} entranceId={entranceId} disabled={state !== 'IDLE'} />
      )}
      {!!gatheringTiles.length &&
        gatheringTiles.map((tileType) => (
          <GatherResourceButton key={tileType} tileType={tileType as Exclude<TileType, 'GROUND' | 'OBJECT'>} disabled={state !== 'IDLE'} />
        ))}
      {(entranceTile || placeTile) && <Separator className="hidden sm:block" />}
    </>
  );
});
