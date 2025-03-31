import { useAuth } from '@/api/hooks/useAuth';
import { cn } from '@/lib/utils';
import { HeartIcon } from 'lucide-react';
import React from 'react';

import { Button } from './ui/button';

interface Props {
  points: number;
  isUpvoted: boolean | undefined;
  onUpvote: () => void;
}

export const UpvoteIcon = ({ isUpvoted, onUpvote, points }: Props) => {
  const user = useAuth();
  return (
    <div className="flex items-center gap-1">
      <Button
        disabled={!user}
        onClick={() => {
          onUpvote();
        }}
        className="group size-7"
        variant={'ghost'}
        size={'icon'}
      >
        <HeartIcon
          className={cn('text-muted-foreground/40 group-hover:text-muted-foreground', {
            'fill-primary': isUpvoted,
          })}
        />
      </Button>
      <p
        className={cn('text-muted-foreground/40 text-xs', {
          'text-primary/70': isUpvoted,
        })}
      >
        {points}
      </p>
    </div>
  );
};
