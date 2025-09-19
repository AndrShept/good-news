import { RefObject, useState } from 'react';

interface IUseSetHoverIndex {
  isDragging: boolean;
  containerRef: RefObject<null | HTMLDivElement>;
  scale: number;
  MAP_HEIGHT: number;
  TILE_SIZE: number;
  MAP_WIDTH: number;
}

export const useSetHoverIndex = ({ MAP_HEIGHT, MAP_WIDTH, TILE_SIZE, containerRef, isDragging, scale }: IUseSetHoverIndex) => {
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    if (isDragging && start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      containerRef.current.scrollLeft -= dx;
      containerRef.current.scrollTop -= dy;

      setStart({ x: e.clientX, y: e.clientY });
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();

    // враховуємо зум (scale)
    const relativeX = (e.clientX - rect.left + containerRef.current.scrollLeft) / scale;
    const relativeY = (e.clientY - rect.top + containerRef.current.scrollTop) / scale;

    const x = Math.floor(relativeX / TILE_SIZE);
    const y = Math.floor(relativeY / TILE_SIZE);

    if (x >= 0 && x < MAP_WIDTH && y >= 0 && y < MAP_HEIGHT) {
      setHoverIndex(y * MAP_WIDTH + x);
    } else {
      setHoverIndex(null);
    }
  };

  return {
    hoverIndex,
    handleMouseMove,
    setStart
  };
};
