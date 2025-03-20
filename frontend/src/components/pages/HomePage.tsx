import { getPostsQueryOptions } from '@/api/post-api';
import { orderSchema, paginationSchema, sortBySchema } from '@/shared/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useSearchParams } from 'react-router';
import { z } from 'zod';

import { SortBy } from '../SortBy';
import { Spinner } from '../Spinner';
import SvgSpinnersBarsRotateFade from '../SvgSpinnersBarsRotateFade';
import { PostCard } from '../post/PostCard';
import { PostCreateFrom } from '../post/PostCreateFrom';
import { Button } from '../ui/button';

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
  } = useInfiniteQuery({
    ...getPostsQueryOptions(parsedQuery),
    queryKey: ['posts', parsedQuery.order, parsedQuery.sortBy],
  });
  const { ref } = useInView({
    threshold: 0,
    onChange(inView) {
      if (hasNextPage && inView) {
        fetchNextPage();
      }
    },
  });
  const defaultOrderValue = parsedQuery.order || paginationSchema.shape.order._def.defaultValue();
  const defaultSortByValue = parsedQuery.sortBy || paginationSchema.shape.sortBy._def.defaultValue();
  const sortByVariant = sortBySchema.Values;
  const [order, setOrder] = useState<z.infer<typeof orderSchema> | string>(defaultOrderValue);
  const [sortBy, setSortBy] = useState<z.infer<typeof sortBySchema> | string>(defaultSortByValue);

  if (isLoading) return <Spinner />;
  return (
    <div className="mx-auto flex flex-col space-y-4">
      <PostCreateFrom />
      <SortBy order={order} sortBy={sortBy} setOrder={setOrder} setSortBy={setSortBy} sortByVariant={sortByVariant} />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {posts?.pages.map((page) => page.data.map((post) => <PostCard post={post} />))}
      </ul>

      <div className="mb-20" ref={ref} />
      {isFetchingNextPage && <SvgSpinnersBarsRotateFade className="mx-auto size-6" />}
    </div>
  );
};
