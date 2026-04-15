import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import React, { ComponentProps, ReactNode, memo } from 'react';

interface Props extends ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  children: ReactNode;
  matches: boolean;
}

export const PlaceSidebarButton = memo(function PlaceSidebarButton({ className, matches, children, variant, size, ...props }: Props) {
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
});
