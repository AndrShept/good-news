import { GameIcon } from '@/components/GameIcon';
import { HeroAvatar } from '@/components/HeroAvatar';
import { imageConfig } from '@/shared/config/image-config';
import { HeroSidebarItem } from '@/shared/types';
import { memo } from 'react';

import { HeroSidebarListSkeleton } from './HeroSidebarListSkeleton';

interface Props {
  heroes: HeroSidebarItem[] | undefined;
  isLoading: boolean;
}

export const HeroSidebarList = memo(({ heroes, isLoading }: Props) => {
  return (
    <ul className="hidden w-full max-w-[200px] flex-col gap-1 p-1.5 sm:flex">
      {!isLoading ? (
        heroes?.map((hero) => (
          <li key={hero.id} className="hover:bg-secondary flex items-center gap-1.5 rounded px-2 py-1 duration-75">
            <HeroAvatar size={'sm'} src={hero.avatarImage} />
            <div className=" text-sm">
              <div className="inline-flex items-center gap-1">
                <span className="line-clamp-1 font-semibold">{hero.name}</span>
                <GameIcon className="size-4" image={imageConfig.icon.state[hero.state]} />
              </div>
              <p className="text-muted-foreground">level: ({hero.level})</p>
            </div>
          </li>
        ))
      ) : (
        <HeroSidebarListSkeleton />
      )}
    </ul>
  );
});
