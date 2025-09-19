import { IPosition } from '@/shared/types';
import { Dispatch, SetStateAction, useState } from 'react';

interface IUseDragOnMap {
  setStart: (data: IPosition | null) => void;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
}

export const useDragOnMap = ({ setIsDragging, setStart }: IUseDragOnMap) => {
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setStart(null);
  };

  return {
    handleMouseDown,
    handleMouseUp,
  };
};
