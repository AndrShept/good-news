import { useUpvotePost } from '@/api/hooks/useUpvotePost';
import { cn, getFormatDateTime } from '@/lib/utils';
import { Post } from '@/shared/types';
import { MessageSquareDotIcon } from 'lucide-react';

import { UpvoteIcon } from '../UpvoteIcon';
import { UserAvatar } from '../UserAvatar';
import { Button } from '../ui/button';

interface Props {
  post: Post;
}

export const PostCard = ({ post }: Props) => {
  const { mutate } = useUpvotePost();

  return (
    <li className="hover:border-primary/70 hover:bg-secondary/50 flex flex-col gap-2 border p-3">
      <div>
        <UserAvatar size={'md'} url={post.author?.image} />
        <time className="text-muted-foreground text-xs">{getFormatDateTime(post.createdAt)}</time>
      </div>

      <h2 className="line-clamp-1 text-xl font-semibold">{post.title}</h2>
      <p className="text-muted-foreground line-clamp-4 text-[15px]">{post.content}</p>
      <section className="mt-auto flex items-center gap-1">
        <UpvoteIcon isUpvoted={post.isUpvoted} points={post.points} onUpvote={() => mutate(post.id.toString())} />
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
