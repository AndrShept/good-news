import { InvitePartyButtons } from '@/components/InvitePartyButtons';
import { LogOutButton } from '@/components/LogOutButton';
import { BackpackIcon } from '@/components/game-icons/BackpackIcon';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { HeroIcon } from '@/components/game-icons/HeroIcon';
import { LogoIcon } from '@/components/game-icons/LogoIcon';
import { PremIcon } from '@/components/game-icons/PremIcon';
import { ShopIcon } from '@/components/game-icons/ShopIcon';
import { Button, buttonVariants } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';
import { useBackpack } from '@/store/useBackpack';
import { Link } from '@tanstack/react-router';

import { AddPartyButton } from '../../group/components/AddGroupButton';

export const GameHeader = () => {
  const { currentInventorySlots, goldCoins, maxInventorySlots, premiumCoins } = useHero((state) => ({
    goldCoins: state?.data?.goldCoins,
    premiumCoins: state?.data?.premiumCoins,
    currentInventorySlots: state?.data?.currentInventorySlots,
    maxInventorySlots: state?.data?.maxInventorySlots,
  }));
  const isOpen = useBackpack((state) => state.isOpen);
  const onOpen = useBackpack((state) => state.onOpen);
  return (
    <header className="bg-background/80 backdrop-blur-xs sticky top-0 z-50 mb-3 flex items-center justify-between border-b px-4 py-2">
      <section>
        <Link to="/">
          <LogoIcon />
        </Link>
      </section>
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
        <InvitePartyButtons />
        <AddPartyButton />
      </section>
      <section className="flex items-center gap-1 text-[15px]">
        <LogOutButton />
        <div className="flex items-center gap-0.5">
          <GoldIcon />
          <p>{goldCoins}</p>
        </div>
        <div className="flex items-center gap-0.5">
          <PremIcon classname="size-6" />
          <p>{premiumCoins}</p>
        </div>
        <div className="flex items-center">
          <BackpackIcon />
          <p>{currentInventorySlots}</p>/<p>{maxInventorySlots}</p>
        </div>
      </section>
    </header>
  );
};
