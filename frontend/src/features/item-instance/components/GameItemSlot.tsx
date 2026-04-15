import { cn } from '@/lib/utils';
import { ComponentProps, ReactNode, memo } from 'react';

interface Props extends ComponentProps<'div'> {
  children?: ReactNode;
}

export const GameItemSlot = memo(function GameItemSlot({ children, className, ...props }: Props) {
  return <div className={cn('hover:saturate-105 hover:border-foreground/20 group relative size-12 border', className)}>{children}</div>;
});
