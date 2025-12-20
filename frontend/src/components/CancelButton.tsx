import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from './ui/button';

type Props = ComponentProps<'button'>;

export const CancelButton = ({ className, ...props }: Props) => {
  return (
    <Button {...props} size={'icon'} variant={'outline'} className={cn('size-10 hover:text-red-500', className)}>
      <X className="size-5" />
    </Button>
  );
};
