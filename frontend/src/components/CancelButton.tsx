import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { ComponentProps, ReactNode } from 'react';

import { Button } from './ui/button';

type Props = ComponentProps<'button'> & {
  children?: ReactNode
}
export const CancelButton = ({ className, children, ...props }: Props) => {
  return (
    <Button {...props} variant={'outline'} className={cn('hover:text-red-500', className)}>
      <X className="size-5" />
      {children}
    </Button>
  );
};
