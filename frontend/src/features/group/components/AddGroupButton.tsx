import { HeroAvatar } from '@/components/HeroAvatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { getGroupAvailableHeroesOptions } from '@/features/group/api/get -group-available-heroes';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { CheckIcon, PlusIcon, SearchIcon } from 'lucide-react';
import React from 'react';

export const AddPartyButton = () => {
  const { data, hasNextPage, fetchNextPage } = useSuspenseInfiniteQuery(getGroupAvailableHeroesOptions());

  return (
    <Popover>
      <PopoverTrigger>
        {' '}
        <Button variant={'outline'} size={'icon'}>
          <PlusIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent side="right" align="start">
        <section className="flex flex-col gap-4">
          <h3 className="text-center text-xl"> Add party member</h3>
          <div className="relative flex">
            <SearchIcon className="text-muted-foreground absolute bottom-[8px] left-2 size-5" />
            <Input placeholder="search..." className="pl-8.5" />
          </div>
          <ul className="flex flex-col gap-2">
            {data.pages.map((page) =>
              page?.data.map((hero) => (
                <article className="hover:bg-accent/20 flex items-center gap-1 px-3 py-2 rounded">
                  <div>
                    <HeroAvatar src={hero.avatarImage} />
                  </div>
                  <div>
                    <p>{hero.name}</p>
                    <p className="text-muted-foreground text-sm">level {hero.level}</p>
                  </div>
                  <div className="ml-auto">
                    <Button className="" variant={'outline'} size={'sm'}>
                      <span>Invite</span>
                      <CheckIcon className="text-green-500" />
                    </Button>
                  </div>
                </article>
              )),
            )}
          </ul>
        </section>
      </PopoverContent>
    </Popover>
  );
};
