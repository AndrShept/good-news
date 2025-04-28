import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/lib/utils';
import { createCommentSchema } from '@/shared/types';
import { SendHorizonalIcon } from 'lucide-react';
import React, { ComponentProps, Dispatch, SetStateAction, useState } from 'react';
import { z } from 'zod';

import { UserAvatar } from './UserAvatar';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Props extends ComponentProps<'div'> {
  id: string;
  onCreate: ({ form, id }: { id: string; form: z.infer<typeof createCommentSchema> }) => void;
  isButtonDisable: boolean;
  onHide?: () => void;
  isUserAvatar?: boolean;
}

export const CreateCommentForm = ({ id, onCreate, isButtonDisable, onHide, className, isUserAvatar = false, ...props }: Props) => {
  const [content, setContent] = useState('');
  const user = useAuth();

  const handleSubmit = () => {
    if (!content.trim().length) return;
    const form = { content };

    onCreate({ id, form });
    setContent('');
    onHide?.();
  };
  return (
    <div className={cn('relative flex items-center gap-1', className)}>
      {isUserAvatar && <UserAvatar className="mr-2" url={user?.image} />}
      <Input disabled={!user} value={content} onChange={(e) => setContent(e.target.value)} placeholder="add comment..." />
      <Button onClick={handleSubmit} disabled={!content.length || isButtonDisable} variant={'ghost'} size={'icon'}>
        <SendHorizonalIcon className="text-muted-foreground" />
      </Button>
    </div>
  );
};
