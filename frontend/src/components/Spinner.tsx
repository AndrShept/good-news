import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { ComponentProps } from 'react';

import SvgSpinnersBarsRotateFade from './SvgSpinnersBarsRotateFade';

const spinnerVariants = cva('', {
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const Spinner = ({ size, className, ...props }: ComponentProps<'div'> & VariantProps<typeof spinnerVariants>) => {
  return (
    <div className={cn('m-auto', className)}>
      <SvgSpinnersBarsRotateFade className={spinnerVariants({ size })} />
    </div>
  );
};
