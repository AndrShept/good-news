import { Button } from '@/components/ui/button';
import { Virtualizer } from '@tanstack/react-virtual';
import React, { useEffect } from 'react';

interface Props {
  colVirtualizer: Virtualizer<HTMLDivElement, Element>;
  rowVirtualizer: Virtualizer<HTMLDivElement, Element>;
  posX: number;
  posY: number;
}

export const ScrollMap = ({ colVirtualizer, rowVirtualizer, posX, posY }: Props) => {
  const scrollToHero = (heroX: number, heroY: number) => {
    rowVirtualizer.scrollToIndex(heroY, {
      align: 'center',
      behavior: 'smooth',
    });

    colVirtualizer.scrollToIndex(heroX, {
      align: 'center',
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    scrollToHero(posX, posY);
  }, [posX, posY]);
  return (
    <div className="mx-auto">
      <Button onClick={() => scrollToHero(posX, posY)}>To Hero</Button>
      <Button onClick={() => colVirtualizer.scrollBy(-100, { behavior: 'smooth' })}> left </Button>
      <Button onClick={() => colVirtualizer.scrollBy(100, { behavior: 'smooth' })}> right </Button>
      <Button onClick={() => rowVirtualizer.scrollBy(-100, { behavior: 'smooth' })}> top </Button>
      <Button onClick={() => rowVirtualizer.scrollBy(100, { behavior: 'smooth' })}> bottom </Button>
    </div>
  );
};
