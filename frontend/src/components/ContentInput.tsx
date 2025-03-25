import { SendHorizonalIcon } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from './ui/button';
import { Input } from './ui/input';

export const ContentInput = () => {
  const [content, setCOntent] = useState('');
  return (
    <div className="relative flex items-center gap-1">
      <Input value={content} onChange={(e) => setCOntent(e.target.value)} placeholder="add comment..." />
      <Button disabled={!content.length} variant={'ghost'} size={'icon'}>
        <SendHorizonalIcon className="text-muted-foreground" />
      </Button>
    </div>
  );
};
