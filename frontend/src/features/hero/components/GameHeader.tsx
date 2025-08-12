import { LogOutButton } from '@/components/LogOutButton';
import { BackpackIcon } from '@/components/game-icons/BackpackIcon';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { LogoIcon } from '@/components/game-icons/LogoIcon';
import { PremIcon } from '@/components/game-icons/PremIcon';
import { Button } from '@/components/ui/button';
import { GroupMenuButton } from '@/features/group/components/GroupMenuButton';
import { useHero } from '@/features/hero/hooks/useHero';
import { useBackpack } from '@/store/useBackpack';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

import { CharacterPaperdollButton } from './CharacterPaperdollButton';

export const GameHeader = memo(() => {
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
        <CharacterPaperdollButton />

        <Button onClick={onOpen} className="" variant={isOpen ? 'default' : 'outline'} size="icon">
          <BackpackIcon />
        </Button>
        <GroupMenuButton />
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
          <BackpackIcon className="size-7" />
          <p>{currentInventorySlots}</p>/<p>{maxInventorySlots}</p>
        </div>
      </section>
    </header>
  );
});
