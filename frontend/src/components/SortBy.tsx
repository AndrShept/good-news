import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { paginationSchema, sortBySchema } from '@/shared/types';
import qs from 'query-string';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

interface Props {
  order: string;
  sortBy: string;
  sortByVariant: typeof sortBySchema.Values;
  setOrder: Dispatch<SetStateAction<string>>;
  setSortBy: Dispatch<SetStateAction<string>>;
}

export const SortBy = ({ order, setOrder, setSortBy, sortBy, sortByVariant }: Props) => {
  const navigate = useNavigate();
  const query = qs.stringifyUrl(
    {
      url: '',
      query: {
        order,
        sortBy,
      },
    },
    { skipEmptyString: true },
  );
  useEffect(() => {
    console.log('render')
    navigate(query);
  }, [order, sortBy]);
  return (
    <div className="flex gap-2">
      <Select defaultValue={order} onValueChange={(e) => setOrder(e)}>
        <SelectTrigger className="">
          <SelectValue placeholder={order} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={'asc'}>asc</SelectItem>
          <SelectItem value="desc">desc</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue={sortBy} onValueChange={(e) => setSortBy(e)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={sortBy} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={sortByVariant.points}>{sortByVariant.points}</SelectItem>
          <SelectItem value={sortByVariant.recent}>{sortByVariant.recent}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
