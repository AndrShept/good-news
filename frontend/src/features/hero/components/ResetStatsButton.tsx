import { ConfirmPopover } from '@/components/ConfirmPopover';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { Button } from '@/components/ui/button';

import { useResetStats } from '../hooks/useResetStats';

import { useHeroId } from '../hooks/useHeroId';
export const ResetStatsButton = () => {
  const id = useHeroId();
  const { mutate, isPending } = useResetStats();
  const onReset = () => {
    mutate(id);
  };
  return (
    <ConfirmPopover onConfirm={onReset}>
      <ConfirmPopover.Trigger>
        <Button disabled={isPending} className="mt-2 w-full" variant={'default'} size={'sm'}>
          <GoldIcon className="mr-1 size-5" /> Reset
        </Button>
      </ConfirmPopover.Trigger>
      <ConfirmPopover.Content>
        <ConfirmPopover.Title>Are you sure you want to reset your hero stats?</ConfirmPopover.Title>
        <ConfirmPopover.Message className="inline-flex text-yellow-500">
          This will cost 100
          <GoldIcon className="ml-1 size-5" />
        </ConfirmPopover.Message>
      </ConfirmPopover.Content>
    </ConfirmPopover>
  );
};
