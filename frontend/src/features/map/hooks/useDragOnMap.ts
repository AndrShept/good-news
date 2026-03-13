import { RefObject } from 'react';

interface IUseDragOnMap {
  isDraggingRef: RefObject<boolean>;
  setIsDragging: (val: boolean) => void;
  setStart: (data: { x: number; y: number } | null) => void;
}

export const useDragOnMap = ({ isDraggingRef, setIsDragging, setStart }: IUseDragOnMap) => {
  const handleMouseDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    isDraggingRef.current = true;
    setIsDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    setIsDragging(false);
    setStart(null);
  };

  return {
    handleMouseDown,
    handleMouseUp,
  };
};
