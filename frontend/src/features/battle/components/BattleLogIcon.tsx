import { GameIcon } from '@/components/GameIcon';
import { cn } from '@/lib/utils';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'div'> {
  image: string;
  label: string;
}

export const BattleLogIcon = ({ image, label, className }: Props) => {
  return (
    <div className="relative ml-1 inline-flex flex-col items-center justify-center">
      <GameIcon className="size-5.5" image={image} />
      <span
        style={{
          textShadow: `
        1px 1px 0 #000,
        -1px 1px 0 #000,
        1px -1px 0 #000,
        -1px -1px 0 #000
      `,
        }}
        className={cn('absolute -bottom-0 text-[10px] font-bold drop-shadow-[0_1px_1px_black]', className)}
      >
        {label}
      </span>
    </div>
  );
};
