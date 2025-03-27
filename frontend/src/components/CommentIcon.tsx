import { cn } from '@/lib/utils';
import { MessageSquareDotIcon } from 'lucide-react';
import React from 'react';

import { Button } from './ui/button';

interface Props {
  commentCount: number;
  onClick: () => void;
}
export const CommentIcon = ({ commentCount, onClick }: Props) => {
  return (
    <div className="flex items-center gap-1">
      <Button onClick={onClick} className="group size-7" variant={'ghost'} size={'icon'}>
        <MessageSquareDotIcon className={cn('text-muted-foreground/40 group-hover:text-muted-foreground', {})} />
      </Button>
      <p className="text-muted-foreground/40 text-xs">{commentCount}</p>
    </div>
  );
};
