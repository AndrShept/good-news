import { GameItem } from '@/shared/types';
import React from 'react';

import { Button } from './ui/button';

interface Props {
  gameItem: GameItem | undefined;
  quantity?: number;
}
export const GameItemCardPopupMenu = ({ gameItem, quantity }: Props) => {
  return (
    <section className="space-y-1 p-1">
      <Button variant={'ghost'} className="flex w-full items-center">
        <img className="size-6" src="/sprites/icons/equip.png" />
        <p className="text-[12px]">Equip</p>
      </Button>
      <Button variant={'ghost'} className="flex w-full items-center transition hover:text-red-500">
        <div>X</div>

        <p className="text-[12px]">Delete</p>
      </Button>
    </section>
  );
};
