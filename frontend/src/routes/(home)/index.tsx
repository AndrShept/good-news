import { InfinityScrollComponent } from '@/components/InfinityScrollComponent';
import { SortByFilter } from '@/components/SortByFilter';
import { Spinner } from '@/components/Spinner';
import { getPostsQueryOptions } from '@/features/post/api/get-posts';
import { PostCard } from '@/features/post/components/PostCard';
import { PostCreateFrom } from '@/features/post/components/PostCreateFrom';
import { childrenVariants, parentVariants } from '@/lib/animation';
import { orderSchema, paginationSchema, sortBySchema } from '@/shared/types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { fallback, zodValidator } from '@tanstack/zod-adapter';
import * as m from 'motion/react-m';
import { useState } from 'react';
import { z } from 'zod';

export const SearchSchema = z.object({
  sortBy: fallback(sortBySchema, 'recent').default('recent'),
  order: fallback(orderSchema, 'asc').default('asc'),
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

  if (isLoading) return <Spinner />;
  return (
    <div className="mx-auto flex w-full flex-col space-y-4">
      <PostCreateFrom />
      <SortByFilter order={order} sortBy={sortBy} />
      <InfinityScrollComponent isFetchingNextPage={isFetchingNextPage} hasNextPage={hasNextPage} fetchNextPage={fetchNextPage}>
        <m.ul variants={parentVariants} initial="hidden" animate="visible" className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {posts?.pages.map((page) =>
            page.data.map((post) => (
              <m.div  key={post.id}>
                <PostCard post={post} />
              </m.div>
            )),
          )}
        </m.ul>
      </InfinityScrollComponent>
    </div>
  );
}
