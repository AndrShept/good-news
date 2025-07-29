import { Search } from '@/components/Search';
import { GroupIcon } from '@/components/game-icons/GroupIcon';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useHero } from '@/features/hero/hooks/useHero';
import { cn } from '@/lib/utils';
import { PlusIcon } from 'lucide-react';
import React, { useCallback, useState } from 'react';

import { CreateGroupButton } from './CreateGroupButton';
import { GroupAvailableHeroesList } from './GroupAvailableHeroesList';
import { GroupMembersList } from './GroupMembersList';

export const GroupMenuButton = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isShow, setIsShow] = useState(false);
  const groupId = useHero((state) => state?.data?.groupId);
  const onSearch = useCallback((value: string) => setSearchTerm(value), []);
  return (
    <Popover open={isShow} onOpenChange={setIsShow}>
      <PopoverTrigger asChild>
        <Button variant={isShow ? 'secondary' : 'outline'} size={'icon'}>
          <GroupIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn(`overflow-hidden p-0`)} side="right" align="start">
        <section className="relative flex h-[500px] flex-col gap-4 p-4">
          <h3 className="text-center text-xl"> Add group members</h3>

          <GroupMembersList />
          <Search searchTerm={searchTerm} setSearchTerm={onSearch} />
          <GroupAvailableHeroesList isShow={isShow} searchTerm={searchTerm} />
          {!groupId && (
            <div className="backdrop-blur-xs absolute left-0 top-0 flex size-full items-center justify-center bg-black/80">
              <CreateGroupButton />
            </div>
          )}
        </section>
      </PopoverContent>
    </Popover>
  );
};
