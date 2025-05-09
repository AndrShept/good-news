import { ConfirmPopover } from '@/components/ConfirmPopover';
import { GoldIcon } from '@/components/game-icons/GoldIcon';
import { Button } from '@/components/ui/button';
import { useHero } from '@/hooks/useHero';
import { toastError } from '@/lib/utils';
import { useGameMessages } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';
import React from 'react';

import { resetStats } from '../api/reset-stats';

export const ResetStatsButton = () => {
  const { id } = useHero();
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const { isPending, mutate } = useMutation({
    mutationFn: resetStats,
    onSuccess(data, variables, context) {
      if (data.success) {
        setGameMessage({
          success: data.success,
          type: 'success',
          text: data.message,
        });
      }
      if (!data.success) {
        setGameMessage({
          success: data.success,
          type: 'error',
          text: data.message,
        });
      }
    },
    onError: () => {
      toastError();
    },
  });
  const onReset = () => {
    mutate(id);
  };
  return (
    <ConfirmPopover onConfirm={onReset}>
      <ConfirmPopover.Trigger>
        <Button disabled={isPending} className="mt-2 w-full" variant={'default'} size={'sm'}>
          <GoldIcon classname="size-5 mr-1" /> reset
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
