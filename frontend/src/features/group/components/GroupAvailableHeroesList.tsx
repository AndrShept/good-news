import { HeroAvatar } from '@/components/HeroAvatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';

import { getGroupAvailableHeroesOptions } from '../api/get-group-available-heroes';
import { InviteGroupButton } from './InviteGroupButton';

interface Props {
  searchTerm: string;
  isShow: boolean;
}

export const GroupAvailableHeroesList = ({ isShow, searchTerm }: Props) => {
  const selfId = useHeroId();
  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    ...getGroupAvailableHeroesOptions({ searchTerm, selfId }),
    enabled: isShow,
  });
  return (
    <ul className="flex h-full flex-col gap-2">
      <ScrollArea className="">
        {data?.pages.map((page) =>
          page?.data.map((hero) => (
            <article key={hero.id} className="hover:bg-accent/20 flex w-full items-center gap-1 rounded px-3 py-2">
              <div className="flex gap-1">
                <HeroAvatar src={hero.avatarImage} />
                <div className="">
                  <p className="line-clamp-1">{hero.name} </p>
                  <p className="text-muted-foreground text-sm">level {hero.level}</p>
                </div>
              </div>

              <div className="ml-auto">
                <InviteGroupButton toHeroId={hero.id} searchTerm={searchTerm} />
              </div>
            </article>
          )),
        )}
      </ScrollArea>
      {!data?.pages[0]?.data.length && !isLoading && <p className="text-muted-foreground/70 m-auto text-sm">not found</p>}
    </ul>
  );
};
