import { TownIcon } from '@/components/game-icons/TownIcon';
import { Button } from '@/components/ui/button';
import React from 'react';

type Props = {
  isTown: boolean;
};

export const TileActions = ({ isTown }: Props) => {
  return (
    <section className="mt-auto flex flex-wrap">
      <Button  disabled={!isTown}>
        <TownIcon /> Enter Town
      </Button>
    </section>
  );
};
