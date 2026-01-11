import { cn } from '@/lib/utils';
import { VariantProps, cva } from 'class-variance-authority';
import { ComponentProps } from 'react';

export const CounterBadgeVariant = cva(
  'ring-3 ring-background bg-secondary size-5.5 absolute -top-2 left-7 flex items-center justify-center rounded-full  ',
  {
    variants: {
      size: {
        xs: 'size-4 text-[9px]',
        sm: 'size-5.5 text-xs',
        md: 'size-6.5 text-sm',
        lg: 'size-8 text-base',
      },
    },
    defaultVariants: { size: 'sm' },
  },
);

interface Props extends VariantProps<typeof CounterBadgeVariant>, ComponentProps<'div'> {
  value: number;
}
export const CounterBadge = ({ value, size, className, ...props }: Props) => {
  return <div className={cn(CounterBadgeVariant({ className, size }))}>{value}</div>;
};
