import { HeroAvatar } from '@/components/HeroAvatar';
import { Search } from '@/components/Search';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getGroupAvailableHeroesOptions } from '@/features/group/api/get -group-available-heroes';
import { useHero } from '@/features/hero/hooks/useHero';
import { useInfiniteQuery } from '@tanstack/react-query';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { InviteGroupButton } from './InviteGroupButton';

export const GroupMenuButton = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isShow, setIsShow] = useState(false);
  const selfId = useHero((state) => state?.data?.id ?? '');
  const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery({
    ...getGroupAvailableHeroesOptions({ searchTerm, selfId }),
    enabled: isShow,
  });
  const onSearch = useCallback((value: string) => setSearchTerm(value), []);
  return (
    <Popover open={isShow} onOpenChange={setIsShow}>
      <PopoverTrigger asChild>
        <Button variant={isShow ? 'secondary' : 'outline'} size={'icon'}>
          <PlusIcon className="size-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start">
        <section className="flex h-[500px] flex-col gap-4">
          <h3 className="text-center text-xl"> Add group members</h3>
          <Search searchTerm={searchTerm} setSearchTerm={onSearch} />
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
                      <InviteGroupButton toHeroId={hero.id} />
                    </div>
                  </article>
                )),
              )}
            </ScrollArea>
            {!data?.pages[0]?.data.length && !isLoading && <p className="text-muted-foreground/70 m-auto text-sm">not found</p>}
          </ul>
        </section>
      </PopoverContent>
    </Popover>
  );
};
