import { useUpvotePost } from '@/features/post/hooks/useUpvotePost';
import { getFormatDateTime } from '@/lib/utils';
import { Post } from '@/shared/types';
import { useNavigate } from '@tanstack/react-router';

import { CommentIcon } from '../../../components/CommentIcon';
import { UpvoteIcon } from '../../../components/UpvoteIcon';
import { UserAvatar } from '../../../components/UserAvatar';

interface Props {
  post: Post;
}

export const PostCard = ({ post }: Props) => {
  const { mutate } = useUpvotePost();
  const navigate = useNavigate();

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
        <CommentIcon
          commentCount={post.commentCount}
          onClick={() => {
            navigate({
              to: '/post/$postId',
              params: { postId: post.id.toString() },
            });
          }}
        />
      </section>
    </li>
  );
};
