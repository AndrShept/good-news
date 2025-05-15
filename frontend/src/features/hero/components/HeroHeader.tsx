import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { PremIcon } from '@/components/game-icons/PremIcon';
import { useHero } from '@/features/hero/hooks/useHero';
import React from 'react';

export const HeroHeader = () => {
  const hero = useHero();

  return (
    <header className="mb-3 flex h-10 items-center justify-between">
      <section className="flex items-center gap-0.5">
        <div className="flex items-center gap-0.5">
          <GoldIcon classname="size-6" />
          <p>{hero.goldCoins}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <PremIcon classname="size-6" />
          <p>{hero.premiumCoins}</p>
        </div>
      </section>
    </header>
  );
};
