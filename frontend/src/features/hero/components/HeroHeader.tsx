import { BackpackIcon } from '@/components/game-icons/BackpackIcon';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { HeroIcon } from '@/components/game-icons/HeroIcon';
import { PremIcon } from '@/components/game-icons/PremIcon';
import { ShopIcon } from '@/components/game-icons/ShopIcon';
import { Button, buttonVariants } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useBackpack } from '@/store/useBackpack';
import { Link } from '@tanstack/react-router';
import React from 'react';

export const HeroHeader = () => {
  const hero = useHero();
  const isOpen = useBackpack((state) => state.isOpen);
  const onOpen = useBackpack((state) => state.onOpen);
  return (
    <header className="mb-3 flex h-10 items-center justify-between">
      <section className="flex gap-0.5">
        <Link
          className={buttonVariants({ variant: 'outline', size: 'icon', className: 'cursor-default' })}
          to={'/game'}
          activeOptions={{ exact: true }}
          activeProps={{ className: buttonVariants({ variant: 'default', size: 'icon' }) }}
        >
          <HeroIcon />
        </Link>
        <Link
          className={buttonVariants({ variant: 'outline', size: 'icon', className: 'cursor-default' })}
          to={'/game/shop'}
          activeProps={{ className: buttonVariants({ variant: 'default', size: 'icon' }) }}
        >
          <ShopIcon />
        </Link>
        <Button onClick={onOpen} className="" variant={isOpen ? 'default' : 'outline'} size={'icon'}>
          <BackpackIcon />
        </Button>
      </section>
      <section className="flex items-center gap-1 text-[15px]">
        <div className="flex items-center gap-0.5">
          <GoldIcon classname="size-6" />
          <p>{hero.goldCoins}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <PremIcon classname="size-6" />
          <p>{hero.premiumCoins}</p>
        </div>
        <div className="flex items-center">
          <BackpackIcon />
          <p>{hero.currentInventorySlots}</p>/<p>{hero.maxInventorySlots}</p>
        </div>
      </section>
    </header>
  );
};
