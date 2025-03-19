import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { orderSchema, paginationSchema, sortBySchema } from '@/shared/types';
import qs from 'query-string';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { z } from 'zod';

export const SortBy = () => {
  const defaultOrderValue = paginationSchema.shape.order._def.defaultValue();
  const defaultSortByValue = paginationSchema.shape.sortBy._def.defaultValue();
  const sortByVariant = sortBySchema.Values;
  const [order, setOrder] = useState<z.infer<typeof orderSchema> | string>(defaultOrderValue);
  const [sortBy, setSortBy] = useState<z.infer<typeof sortBySchema> | string>(defaultSortByValue);
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
    console.log(order);

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
