import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentProps, ReactNode } from 'react';
import { useMediaQuery } from 'usehooks-ts';

interface Props extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
}

export const PlaceSidebarButton = ({ className, children, variant, size, ...props }: Props) => {
  const matches = useMediaQuery('(min-width: 768px)');
  return (
    <Button
      {...props}
      className={cn('w-full', className, {
        'justify-start': matches,
        'size-12': !matches,
      })}
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
};
