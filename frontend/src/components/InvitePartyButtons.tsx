import { useHero } from '@/features/hero/hooks/useHero';
import type { SocketResponse } from '@/shared/types';
import { socket } from '@/socket';
import { useGameMessages } from '@/store/useGameMessages';
import React, { useState } from 'react';

import { Button } from './ui/button';

export const InvitePartyButtons = () => {
  const selfId = useHero((state) => state?.data?.id ?? '');

  const [isLoading, setIsLoading] = useState(false);
  const invitedHeroId = '0197a6cf-72c1-7000-8c1b-47c82eeae2d7';
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const onInvite = async () => {
    setIsLoading(true);
    const res = (await socket.emitWithAck('invite-party', { selfId, invitedHeroId })) as SocketResponse;
    setIsLoading(false);
    if (!res.success) setGameMessage({ text: res.message, type: 'error' });
    if (res.success) setGameMessage({ text: res.message, type: 'success' });
  };

  return (
    <Button disabled={isLoading} onClick={onInvite} variant={'outline'}>
      Invite
    </Button>
  );
};
