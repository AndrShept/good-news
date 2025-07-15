import { SearchIcon } from 'lucide-react';
import React, { Dispatch, SetStateAction, memo } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { useDebounceCallback } from 'usehooks-ts';

import { Input } from './ui/input';

type Props = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
};

export const Search = memo(({ searchTerm, setSearchTerm }: Props) => {
  const debounced = useDebounceCallback(setSearchTerm, 500);
  return (
    <div className="relative flex">
      <SearchIcon className="text-muted-foreground absolute bottom-[8px] left-2 size-5" />
      <Input defaultValue={searchTerm} onChange={(e) => debounced(e.target.value)} placeholder="search..." className="pl-8.5" />
    </div>
  );
});
