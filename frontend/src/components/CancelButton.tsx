import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ComponentProps } from 'react';

import { Button } from './ui/button';

type Props = ComponentProps<'button'>;

export const CancelButton = ({ className, ...props }: Props) => {
  return (
    <Button {...props} variant={'outline'} className={cn('hover:text-red-500', className)}>
      <X className="size-5" />
      No
    </Button>
  );
};
