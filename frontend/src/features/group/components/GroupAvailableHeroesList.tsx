import { HeroAvatar } from '@/components/HeroAvatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { cn } from '@/lib/utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import { RefreshCcwIcon } from 'lucide-react';
import React from 'react';

import { getGroupAvailableHeroesOptions } from '../api/get-group-available-heroes';
import { GroupAvailableHeroesListSkeleton } from './GroupAvailableHeroesListSkeleton';
import { InviteGroupButton } from './InviteGroupButton';

interface Props {
  searchTerm: string;
  isShow: boolean;
}

export const GroupAvailableHeroesList = ({ isShow, searchTerm }: Props) => {
  const selfId = useHeroId();
  const { data, hasNextPage, fetchNextPage, isLoading, isRefetching, refetch } = useInfiniteQuery({
    ...getGroupAvailableHeroesOptions({ searchTerm, selfId }),
    enabled: isShow,
  });
  return (
    <section className="flex h-full flex-col">
      <Button disabled={isRefetching} onClick={() => refetch()} className="ml-auto size-7" size="icon" variant="outline">
        <RefreshCcwIcon className={cn('size-3', isRefetching && 'animate-spin')} />
      </Button>
      {!isLoading ? (
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
      ) : (
        <GroupAvailableHeroesListSkeleton />
      )}
    </section>
  );
};
