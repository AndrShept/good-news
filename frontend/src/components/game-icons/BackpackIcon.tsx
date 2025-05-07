import { cn } from '@/lib/utils';

export const BackpackIcon = ({ className }: { className?: string }) => {
  return (
    <img
      className={cn('size-8', className)}
      src="/sprites/icons/backpack.png"
      alt="backpack-image"
    />
  );
};
