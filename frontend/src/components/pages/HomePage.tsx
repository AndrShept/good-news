import { getPostsQueryOptions } from '@/api/post-api';
import { orderSchema, paginationSchema, sortBySchema } from '@/shared/types';
import {  useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useSearchParams } from 'react-router';
import { z } from 'zod';

import { InfinityScrollComponent } from '../InfinityScrollComponent';
import { SortBy } from '../SortBy';
import { Spinner } from '../Spinner';
import SvgSpinnersBarsRotateFade from '../SvgSpinnersBarsRotateFade';
import { PostCard } from '../post/PostCard';
import { PostCreateFrom } from '../post/PostCreateFrom';

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const query = Object.fromEntries(searchParams);
  const parsedQuery = paginationSchema.parse(query);

  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    ...getPostsQueryOptions(parsedQuery),
    queryKey: ['posts', parsedQuery.order, parsedQuery.sortBy],
    
  });

  const defaultOrderValue = parsedQuery.order || paginationSchema.shape.order._def.defaultValue();
  const defaultSortByValue = parsedQuery.sortBy || paginationSchema.shape.sortBy._def.defaultValue();
  const sortByVariant = sortBySchema.Values;
  const [order, setOrder] = useState<z.infer<typeof orderSchema> | string>(defaultOrderValue);
  const [sortBy, setSortBy] = useState<z.infer<typeof sortBySchema> | string>(defaultSortByValue);

  if (isLoading) return <Spinner />;
  return (
    <div className="mx-auto w-full flex flex-col space-y-4">
      <PostCreateFrom />
      <SortBy order={order} sortBy={sortBy} setOrder={setOrder} setSortBy={setSortBy} sortByVariant={sortByVariant} />
      <InfinityScrollComponent isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage}>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {posts?.pages.map((page) => page.data.map((post) => <PostCard key={post.id} post={post} />))}
        </ul>
      </InfinityScrollComponent>
    </div>
  );
};
