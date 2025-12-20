import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import React, { ComponentProps } from 'react';

import { Button } from './ui/button';

type Props = ComponentProps<'button'>;

export const AcceptButton = ({ className, ...props }: Props) => {
  return (
    <Button {...props} size={'icon'} variant={'secondary'} className={cn('size-10 hover:text-green-500', className)}>
      <CheckIcon className="size-5" />
    </Button>
  );
};
