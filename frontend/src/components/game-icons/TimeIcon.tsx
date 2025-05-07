import { cn } from '@/lib/utils';

export const TimeIcon = ({ className }: { className?: string }) => {
  return (
    <img
      className={cn('size-8', className)}
      src="/sprites/icons/clock.png"
      alt="clock-image"
    />
  );
};
