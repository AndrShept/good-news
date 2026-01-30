import { GameIcon } from '@/components/GameIcon';
import { LogOutButton } from '@/components/LogOutButton';
import { GroupMenuButton } from '@/features/group/components/GroupMenuButton';
import { useHero } from '@/features/hero/hooks/useHero';
import { BackpackButton } from '@/features/item-container/components/BackpackButton';
import { ContainerCapacityInfo } from '@/features/item-container/components/ContainerCapacityInfo';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { ShopItemCardButton } from '@/features/shop/components/ShopItemCardButton';
import { SkillsPopover } from '@/features/skill/components/SkillsPopover';
import { imageConfig } from '@/shared/config/image-config';
import { Link, useLocation } from '@tanstack/react-router';
import { memo } from 'react';
import { useMediaQuery } from 'usehooks-ts';

import { CharacterPaperdollButton } from './CharacterPaperdollButton';

export const GameHeader = memo(() => {
  const { goldCoins, premiumCoins, placeId } = useHero((data) => ({
    goldCoins: data?.goldCoins,
    premiumCoins: data?.premiumCoins,
    placeId: data?.location.placeId,
  }));
  const { backpack } = useHeroBackpack();
  const { pathname } = useLocation();
  const isMobile = useMediaQuery('(max-width: 640px)');
  return (
    <header className="bg-background/80 backdrop-blur-xs sticky top-0 z-50 mb-3 flex items-center justify-between border-b px-4  py-2">
      <section>
        <Link to="/">
          <GameIcon image={imageConfig.icon.ui.logo} />
        </Link>
      </section>
      <section className="flex gap-0.5">
        <CharacterPaperdollButton type="CHARACTER" />
        <BackpackButton />
        <SkillsPopover />
        <GroupMenuButton />
        {placeId && <ShopItemCardButton />}
      </section>
      <section className="flex items-center gap-1 text-[15px]">
        {pathname === '/' && <LogOutButton />}
        <div className="flex items-center gap-0.5">
          <GameIcon image={imageConfig.icon.ui.gold} />
          <span>{goldCoins}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <GameIcon image={imageConfig.icon.ui.prem} />
          <span>{premiumCoins}</span>
        </div>

        {!isMobile && <ContainerCapacityInfo iconSize='size-6' usedCapacity={backpack?.itemsInstance.length ?? 0} capacity={backpack?.capacity ?? 0} />}
      </section>
    </header>
  );
});
