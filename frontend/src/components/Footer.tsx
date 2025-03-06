import { cn } from '@/lib/utils';
import React, { ComponentProps, ComponentPropsWithRef, FC, HTMLInputTypeAttribute, forwardRef } from 'react';

type Props = ComponentPropsWithRef<'footer'>;
export const Footer = forwardRef<HTMLInputElement, Props>(({ className, ...props }, ref) => {
  return (
    <footer ref={ref} {...props} className={cn('mt-auto border-t p-4 text-center', className)}>
      <p>✨ GoodNews ✨</p>
    </footer>
  );
});
