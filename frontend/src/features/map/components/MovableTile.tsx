import { useWalkOnMap } from '@/features/hero/hooks/useWalkOnMap';
import React from 'react';

interface Props {
  tileId: string;
}

export const MovableTile = ({ tileId }: Props) => {
  const { mutate } = useWalkOnMap();
  const onMove = () => {
    console.log(tileId);
    mutate(tileId);
  };
  return (
    <>
      <button onClick={onMove} className="absolute left-0 top-0 size-full bg-black/50 hover:cursor-pointer" />
    </>
  );
};
