import { useHero } from '@/features/hero/hooks/useHero';
import { socketEvents } from '@/shared/socket-events';
import type { SocketResponse } from '@/shared/types';
import { useGameMessages } from '@/store/useGameMessages';
import React, { useState } from 'react';

import { useSocket } from './providers/SocketProvider';
import { Button } from './ui/button';

export const InvitePartyButtons = () => {
  const fromHeroId = useHero((state) => state?.data?.id ?? '');
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const toHeroId = '0197f3c6-a892-7000-bc4f-95123dfcc99c';
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const onInvite = async () => {
    setIsLoading(true);
    const res = (await socket.emitWithAck(socketEvents.partyInvite(), { fromHeroId, toHeroId })) as SocketResponse;
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
