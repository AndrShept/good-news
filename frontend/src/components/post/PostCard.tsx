import { getPostsQueryOptions, upvotePost } from '@/api/post-api';
import { cn, getFormatDateTime } from '@/lib/utils';
import { GetPostsData, Post } from '@/shared/types';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { HeartIcon, LetterText, MessageSquareDotIcon } from 'lucide-react';
import React from 'react';

import { UserAvatar } from '../UserAvatar';
import { Button } from '../ui/button';

interface Props {
  post: Post;
}

export const PostCard = ({ post }: Props) => {
  const queryClient = useQueryClient();
  const queryKey = getPostsQueryOptions().queryKey;
  const { mutate } = useMutation({
    mutationFn: upvotePost,
    async onMutate(id) {
      await queryClient.cancelQueries({ queryKey: [...queryKey, id] });
      let prevData
      queryClient.setQueriesData<InfiniteData<GetPostsData>>({ queryKey }, (oldData) => {
        if (!oldData) return;
        prevData = oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page) => ({
            ...page,
            data: page.data.map((post) =>
              post.id === +id
                ? {
                    ...post,
                    points: post.isUpvoted ? post.points - 1 : post.points + 1,
                    isUpvoted: !post.isUpvoted,
                  }
                : post,
            ),
          })),
        };
      });

      return { prevData };
    },
    onError: (err, newPost, context) => {
      queryClient.setQueriesData<InfiniteData<GetPostsData>>(
        {
          queryKey,
        },
        () => {
          console.log(context?.prevData);
          return context?.prevData;
        },
      );
    },

  });
  return (
    <li className="hover:border-primary/70 hover:bg-secondary/50 flex flex-col gap-2 border p-3">
      <div>
        <UserAvatar size={'md'} url={post.author?.image} />
        <time className="text-muted-foreground text-xs">{getFormatDateTime(post.createdAt)}</time>
      </div>

      <h2 className="line-clamp-1 text-xl font-semibold">{post.title}</h2>
      <p className="text-muted-foreground line-clamp-4 text-[15px]">{post.content}</p>
      <section className="mt-auto flex items-center gap-1">
        <div className="flex items-center gap-1">
          <Button
            onClick={() => {
              mutate(post.id.toString());
            }}
            className="group size-7"
            variant={'ghost'}
            size={'icon'}
          >
            <HeartIcon
              className={cn('text-muted-foreground/40 group-hover:text-muted-foreground', {
                'fill-primary': post.isUpvoted,
              })}
            />
          </Button>
          <p
            className={cn('text-muted-foreground/40 text-xs', {
              'text-primary/70': post.isUpvoted,
            })}
          >
            {post.points}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button className="group size-7" variant={'ghost'} size={'icon'}>
            <MessageSquareDotIcon className={cn('text-muted-foreground/40 group-hover:text-muted-foreground', {})} />
          </Button>
          <p className="text-muted-foreground/40 text-xs">{post.commentCount}</p>
        </div>
      </section>
    </li>
  );
};
