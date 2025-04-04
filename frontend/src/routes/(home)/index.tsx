import { getPostsQueryOptions } from '@/api/post-api';
import { InfinityScrollComponent } from '@/components/InfinityScrollComponent';
import { SortByFilter } from '@/components/SortByFilter';
import { Spinner } from '@/components/Spinner';
import { PostCard } from '@/components/post/PostCard';
import { PostCreateFrom } from '@/components/post/PostCreateFrom';
import { orderSchema, paginationSchema, sortBySchema } from '@/shared/types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import { useState } from 'react';
import { z } from 'zod';

export const SearchSchema = z.object({
  sortBy: fallback(sortBySchema, 'points').default('recent'),
  order: fallback(orderSchema, 'desc').default('desc'),
});

export const Route = createFileRoute('/(home)/')({
  component: HomePage,
  validateSearch: zodValidator(SearchSchema),
});

function HomePage() {
  const parsedQuery = paginationSchema.parse(paginationSchema);
  const { order, sortBy } = Route.useSearch();
  const {
    data: posts,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery({
    ...getPostsQueryOptions({ ...parsedQuery, order, sortBy }),
    queryKey: ['posts', order, sortBy],
  });
  const sortByVariant = sortBySchema.Values;

  if (isLoading) return <Spinner />;
  return (
    <div className="mx-auto flex w-full flex-col space-y-4">
      <PostCreateFrom />
      <SortByFilter order={order} sortBy={sortBy} sortByVariant={sortByVariant} />
      <InfinityScrollComponent isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage}>
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {posts?.pages.map((page) => page.data.map((post) => <PostCard key={post.id} post={post} />))}
        </ul>
      </InfinityScrollComponent>
    </div>
  );
}
