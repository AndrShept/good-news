import { cn } from '@/lib/utils';
import { CheckIcon } from 'lucide-react';
import { ComponentProps, ReactNode } from 'react';

import { Button } from './ui/button';

type Props = ComponentProps<'button'> & {
  children?: ReactNode
}

export const AcceptButton = ({ className, children, ...props }: Props) => {
  return (
    <Button {...props} variant={'secondary'} className={cn('hover:text-green-500', className)}>
      <CheckIcon className="size-5" />
      {children}
    </Button>
  );
};
