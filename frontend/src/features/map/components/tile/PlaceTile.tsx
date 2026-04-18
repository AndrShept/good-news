import { TPlace } from '@/shared/types';

interface Props extends TPlace {
  TILE_SIZE: number;
  offsetX: number;
  offsetY: number;
}

export const PlaceTile = ({ TILE_SIZE, image, x, y, offsetX, offsetY }: Props) => {
  const localX = x - offsetX;
  const localY = y - offsetY;
  return (
    <div
      style={{
        position: 'absolute',
        transform: `translate(${localX * TILE_SIZE}px, ${localY * TILE_SIZE}px)`,
        backgroundSize: 'cover',
        backgroundImage: `url(${image})`,
        width: TILE_SIZE,
        height: TILE_SIZE,
      }}
      className="drop-shadow-outline-sm"
    />
  );
}
