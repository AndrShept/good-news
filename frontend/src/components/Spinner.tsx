import { VariantProps, cva } from 'class-variance-authority';

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

export const Spinner = ({ size }: VariantProps<typeof spinnerVariants>) => {
  return (
    <div className="m-auto">
      <SvgSpinnersBarsRotateFade className={spinnerVariants({ size })} />
    </div>
  );
};
