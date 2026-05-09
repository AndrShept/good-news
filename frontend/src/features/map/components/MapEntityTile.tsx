import { GameIcon } from '@/components/GameIcon';
import { imageConfig } from '@/shared/config/image-config';
import { MapCorpse, MapCreature, MapHero } from '@/shared/types';
import { memo } from 'react';

type CommonProps = {
  TILE_SIZE: number;
  offsetY: number;
  offsetX: number;
  countOnTile: number;
};

type Props = CommonProps &
  ((MapHero & { entityType: 'HERO' }) | (MapCorpse & { entityType: 'CORPSE' }) | (MapCreature & { entityType: 'CREATURE' }));

export const MapEntityTile = memo(function MapEntityTile(props: Props) {
  const localX = props.x - props.offsetX;
  const localY = props.y - props.offsetY;
  const image = props.entityType === 'HERO' ? props.characterImage : props.image;
  return (
    <div
      className="drop-shadow-outline relative"
      style={{
        position: 'absolute',
        width: props.TILE_SIZE,
        height: props.TILE_SIZE,
        willChange: 'transform',
        imageRendering: 'pixelated',
        transform: `translate(${localX * props.TILE_SIZE}px, ${localY * props.TILE_SIZE}px)`,
        backgroundSize: props.entityType === 'CREATURE' ? `${100 * props.scale}%` : '100%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundImage: `url(${image})`,
      }}
    >
      <div className="absolute -top-2 left-1/2 flex -translate-x-1/2 items-center gap-0.5 text-[6px]">
        {props.entityType === 'HERO' && <GameIcon className="size-1.5" image={imageConfig.icon.state[props.state]} />}
        <p>{props.name}</p>

        {props.countOnTile > 1 && (
          <p className="leading-2 size-2 rounded-full bg-teal-800 text-center text-[5px] text-white">{props.countOnTile}</p>
        )}
      </div>
    </div>
  );
});
