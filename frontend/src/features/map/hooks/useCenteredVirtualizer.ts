import { Map } from '@/shared/types';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type UseCenteredVirtualizerProps = {
  map: Map | undefined;
  hero: { posX: number; posY: number };
  tileWidth: number;
  tileHeight: number;
};

export const useCenteredVirtualizer = ({ map, hero, tileWidth, tileHeight }: UseCenteredVirtualizerProps) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: map?.tilesGrid ? map.tilesGrid.length : 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => tileHeight,
  });

  const colVirtualizer = useVirtualizer({
    count: map?.tilesGrid ? map.tilesGrid[0].length : 1,
    getScrollElement: () => parentRef.current,
    estimateSize: () => tileWidth,
    horizontal: true,
  });

  return { parentRef, rowVirtualizer, colVirtualizer };
};
