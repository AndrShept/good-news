import { GameIcon } from '@/components/GameIcon';
import { LogOutButton } from '@/components/LogOutButton';
import { Button } from '@/components/ui/button';
import { GroupMenuButton } from '@/features/group/components/GroupMenuButton';
import { useHero } from '@/features/hero/hooks/useHero';
import { BackpackButton } from '@/features/item-container/components/BackpackButton';
import { ContainerUsedSlots } from '@/features/item-container/components/ContainerUsedSlots';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { SkillsPopover } from '@/features/skill/components/SkillsPopover';
import { imageConfig } from '@/shared/config/image-config';
import { useBackpack } from '@/store/useBackpack';
import { Link } from '@tanstack/react-router';
import { memo } from 'react';

import { CharacterPaperdollButton } from './CharacterPaperdollButton';

export const GameHeader = memo(() => {
  const { goldCoins, premiumCoins } = useHero((data) => ({
    goldCoins: data?.goldCoins,
    premiumCoins: data?.premiumCoins,
  }));
  const { backpack } = useHeroBackpack();

  return (
    <header className="bg-background/80 backdrop-blur-xs sticky top-0 z-50 mb-3 flex items-center justify-between border-b px-4 py-2">
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
      </section>
      <section className="flex items-center gap-1 text-[15px]">
        <LogOutButton />
        <div className="flex items-center gap-0.5">
          <GameIcon image={imageConfig.icon.ui.gold} />
          <span>{goldCoins}</span>
        </div>
        <div className="flex items-center gap-0.5">
          <GameIcon image={imageConfig.icon.ui.prem} />
          <span>{premiumCoins}</span>
        </div>

        <ContainerUsedSlots maxSlots={backpack?.maxSlots ?? 0} usedSlots={backpack?.usedSlots ?? 0} />
      </section>
    </header>
  );
});
