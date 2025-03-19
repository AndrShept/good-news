import { getPostsQueryOptions } from '@/api/post-api';
import { getFormatDateTime } from '@/lib/utils';
import { paginationSchema } from '@/shared/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { Link, useLocation, useParams, useSearchParams } from 'react-router';

import { SortBy } from '../SortBy';
import { Spinner } from '../Spinner';
import { PostCard } from '../post/PostCard';
import { PostCreateFrom } from '../post/PostCreateFrom';
import { Button } from '../ui/button';

export const HomePage = () => {
  const [searchParams] = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());
  const parsedQuery = paginationSchema.parse(query);
  const { data: posts, isLoading, fetchNextPage, hasNextPage,isFetchingNextPage } = useInfiniteQuery(getPostsQueryOptions(parsedQuery));
  console.log(query);
  console.log(parsedQuery);
  console.log(isFetchingNextPage);
  if (isLoading) return <Spinner />;
  return (
    <div className="mx-auto space-y-4">
      <PostCreateFrom />
      <SortBy />
      <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {posts?.pages.map((page) => page.data.map((post) => <PostCard post={post} />))}
      </ul>
      <Button disabled={!hasNextPage} onClick={() => fetchNextPage()} className="">
        CLICK
      </Button>
      {isFetchingNextPage && 'LAODING...'}
    </div>
  );
};
