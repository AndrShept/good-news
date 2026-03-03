import { RefObject, useCallback } from 'react';

interface UseCenter {
  heroPosX: number;
  heroPosY: number;
  containerRef: RefObject<HTMLDivElement | null>;
  TILE_SIZE: number | undefined;
  scale: number;
}

export const useCenter = ({ heroPosX, heroPosY, containerRef, TILE_SIZE, scale }: UseCenter) => {
  const onCenter = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const tileSize = TILE_SIZE ?? 32;

    const heroPixelX = heroPosX * tileSize + tileSize / 2;
    const heroPixelY = heroPosY * tileSize + tileSize / 2;

    const centerX = heroPixelX * scale - container.clientWidth / 2;
    const centerY = heroPixelY * scale - container.clientHeight / 2;

    container.scrollLeft = centerX;
    container.scrollTop = centerY;
  }, [TILE_SIZE, containerRef, heroPosX, heroPosY, scale]);

  return { onCenter };
};
