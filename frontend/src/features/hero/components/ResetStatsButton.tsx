import { ConfirmPopover } from '@/components/ConfirmPopover';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { Button } from '@/components/ui/button';
import { useHero } from '@/features/hero/hooks/useHero';

import { useResetStats } from '../hooks/useResetStats';

export const ResetStatsButton = () => {
  const { id } = useHero();
  const { mutate, isPending } = useResetStats();
  const onReset = () => {
    mutate(id);
  };
  return (
    <ConfirmPopover onConfirm={onReset}>
      <ConfirmPopover.Trigger>
        <Button disabled={isPending} className="mt-2 w-full" variant={'default'} size={'sm'}>
          <GoldIcon classname="size-5 mr-1" /> Reset
        </Button>
      </ConfirmPopover.Trigger>
      <ConfirmPopover.Content>
        <ConfirmPopover.Title>Are you sure you want to reset your hero stats?</ConfirmPopover.Title>
        <ConfirmPopover.Message className="inline-flex text-yellow-500">
          This will cost 100
          <GoldIcon classname="size-5 ml-1" />
        </ConfirmPopover.Message>
      </ConfirmPopover.Content>
    </ConfirmPopover>
  );
};
