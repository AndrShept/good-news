import { Layer } from '@/shared/json-types';
import { StateType } from '@/shared/types';
import { buildPathWithObstacles } from '@/shared/utils';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { RefObject, useRef, useState } from 'react';

interface IUseSetHoverIndex {
  isDragging: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  scale: number;
  MAP_HEIGHT: number;
  TILE_SIZE: number;
  MAP_WIDTH: number;
  heroPosX: number;
  heroPosY: number;
  heroState: StateType;
  layers: Layer[];
}

export const useSetHoverIndex = ({
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  containerRef,
  isDragging,
  scale,
  heroPosX,
  heroPosY,
  heroState,
  layers,
}: IUseSetHoverIndex) => {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const dragStartedRef = useRef(false);
  const lastTapRef = useRef(0);

  const setMovementPathTiles = useMovementPathTileStore((state) => state.setMovementPathTiles);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // DRAG MAP
    if (isDragging && start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      containerRef.current.scrollLeft -= dx;
      containerRef.current.scrollTop -= dy;

      setStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const relativeX = (e.clientX - rect.left + containerRef.current.scrollLeft) / scale;
    const relativeY = (e.clientY - rect.top + containerRef.current.scrollTop) / scale;

    const x = Math.floor(relativeX / TILE_SIZE);
    const y = Math.floor(relativeY / TILE_SIZE);

    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      if(heroState !== 'IDLE') return
      setHoverIndex(y * MAP_WIDTH + x);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseLeave = () => {
    setHoverIndex(null);
    setStart(null);
  };

  const handleTap = () => {
    const now = Date.now();
    if (heroState !== 'IDLE') return;
    if (now - lastTapRef.current < 300) {
      if (dragStartedRef.current) return;
      if (hoverIndex === null) return;

      const x = hoverIndex % MAP_WIDTH;
      const y = Math.floor(hoverIndex / MAP_WIDTH);

      const path = buildPathWithObstacles({ x: heroPosX, y: heroPosY }, { x, y }, layers, MAP_WIDTH, MAP_HEIGHT);
      setMovementPathTiles(path);
    }

    lastTapRef.current = now;
  };

  return {
    hoverIndex,
    handleMouseMove,
    handleMouseLeave,
    setStart,
    handleTap,
  };
};
