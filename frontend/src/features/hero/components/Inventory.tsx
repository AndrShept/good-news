import { useHero } from '@/hooks/useHero';
import { div } from 'motion/react-m';
import React from 'react';

export const Inventory = () => {
  const { inventorySlotMax } = useHero();
  const arr = Array.from({ length: inventorySlotMax });
  return (
    <ul className="flex flex-wrap gap-1 h-fit">
      {arr.map((item) => (
        <li className="size-12 border"></li>
      ))}
    </ul>
  );
};
