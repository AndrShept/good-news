import { cn } from '@/lib/utils';
import { createCommentSchema } from '@/shared/types';
import { SendHorizonalIcon } from 'lucide-react';
import React, { ComponentProps, useState } from 'react';
import { z } from 'zod';

import { Button } from './ui/button';
import { Input } from './ui/input';

interface Props extends ComponentProps<'div'> {
  id: string;
  onCreate: ({ form, id }: { id: string; form: z.infer<typeof createCommentSchema> }) => void;
  isButtonDisable: boolean;
}

export const CreateCommentForm = ({ id, onCreate, isButtonDisable, className, ...props }: Props) => {
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    if (!content.trim().length) return;
    const form = { content };

    onCreate({ id, form });
    setContent('');
  };
  return (
    <div className={cn('relative flex items-center gap-1', className)}>
      <Input value={content} onChange={(e) => setContent(e.target.value)} placeholder="add comment..." />
      <Button onClick={handleSubmit} disabled={!content.length || isButtonDisable} variant={'ghost'} size={'icon'}>
        <SendHorizonalIcon className="text-muted-foreground" />
      </Button>
    </div>
  );
};
