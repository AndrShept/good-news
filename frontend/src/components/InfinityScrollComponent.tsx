import React, { Fragment, ReactNode } from 'react';
import { useInView } from 'react-intersection-observer';

import SvgSpinnersBarsRotateFade from './SvgSpinnersBarsRotateFade';

interface Props {
  children?: ReactNode;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
}
export const InfinityScrollComponent = ({ children, isFetchingNextPage, hasNextPage, fetchNextPage }: Props) => {
  const { ref } = useInView({
    threshold: 0,
    rootMargin: '50px',
    onChange(inView) {
      if (hasNextPage && inView) {
        fetchNextPage();
      }
    },
  });
  return (
    <Fragment>
      {children}
      <div ref={ref} />
      {isFetchingNextPage && <SvgSpinnersBarsRotateFade className="mx-auto size-6" />}
    </Fragment>
  );
};
