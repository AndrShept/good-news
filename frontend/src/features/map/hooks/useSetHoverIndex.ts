import { Layer } from '@/shared/json-types';
import { StateType } from '@/shared/types';
import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { RefObject, useRef, useState } from 'react';

interface IUseSetHoverIndex {
  isDragging: boolean;
  containerRef: RefObject<HTMLDivElement | null>;

  scale: number;

  MAP_HEIGHT: number;
  MAP_WIDTH: number;
  TILE_SIZE: number;

  heroWorldX: number;
  heroWorldY: number;

  heroState: StateType;
  layers: Layer[];

  offsetX: number;
  offsetY: number;
  hoverRef: RefObject<HTMLDivElement | null>;
}

export const useSetHoverIndex = ({
  MAP_HEIGHT,
  MAP_WIDTH,
  TILE_SIZE,
  containerRef,
  isDragging,
  scale,
  heroState,
  layers,
  offsetY,
  offsetX,
  heroWorldX,
  heroWorldY,
  hoverRef,
}: IUseSetHoverIndex) => {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const hoverIndexRef = useRef<number | null>(null);
  const dragStartedRef = useRef(false);
  const lastTapRef = useRef(0);

  const setMovementPathTiles = useMovementPathTileStore((state) => state.setMovementPathTiles);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    // DRAG
    if (isDragging && start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      containerRef.current.scrollLeft -= dx;
      containerRef.current.scrollTop -= dy;

      start.x = e.clientX;
      start.y = e.clientY;
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    const relativeX = (e.clientX - rect.left + containerRef.current.scrollLeft) / scale;
    const relativeY = (e.clientY - rect.top + containerRef.current.scrollTop) / scale;

    const x = Math.floor(relativeX / TILE_SIZE);
    const y = Math.floor(relativeY / TILE_SIZE);

    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      const index = y * MAP_WIDTH + x;

      hoverIndexRef.current = index;

      if (hoverRef.current) {
        hoverRef.current.style.display = 'block';
        hoverRef.current.style.transform = `translate(${x * TILE_SIZE}px, ${y * TILE_SIZE}px)`;
      }
    } else {
      hoverIndexRef.current = null;

      if (hoverRef.current) {
        hoverRef.current.style.display = 'none';
      }
    }
  };

  const handleMouseLeave = () => {
    hoverIndexRef.current = null;
    if(hoverRef?.current){

      hoverRef.current.style.display = 'none';
    }
    setStart(null);
  };

  const handleTap = () => {
    const now = Date.now();

    if (heroState !== 'IDLE') return;

    if (now - lastTapRef.current < 300) {
      if (dragStartedRef.current) return;

      const hoverIndex = hoverIndexRef.current;

      if (hoverIndex === null) return;

      const localX = hoverIndex % MAP_WIDTH;
      const localY = Math.floor(hoverIndex / MAP_WIDTH);

      setMovementPathTiles({
        heroTargetX: localX,
        heroTargetY: localY,
        heroWorldX,
        heroWorldY,
        layers,
        MAP_HEIGHT,
        MAP_WIDTH,
        offsetX,
        offsetY,
      });
    }

    lastTapRef.current = now;
  };

  return {
    hoverIndexRef,
    handleMouseMove,
    handleMouseLeave,
    setStart,
    handleTap,
  };
};
