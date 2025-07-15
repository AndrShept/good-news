import { BorderTrail } from '@/components/ui/border-trail';
import { TextMorph } from '@/components/ui/text-morph';
import { useHero } from '@/features/hero/hooks/useHero';
import { socketEvents } from '@/shared/socket-events';
import type { SocketResponse } from '@/shared/types';
import { useGameMessages } from '@/store/useGameMessages';
import { CheckIcon } from 'lucide-react';
import React, { useState } from 'react';

import { useSocket } from '../../../components/providers/SocketProvider';
import { Button } from '../../../components/ui/button';

export const InviteGroupButton = ({ toHeroId }: { toHeroId: string }) => {
  const fromHeroId = useHero((state) => state?.data?.id ?? '');
  const { socket } = useSocket();
  const [isLoading, setIsLoading] = useState(false);
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const onInvite = async () => {
    setIsLoading(true);
    const res = (await socket.emitWithAck(socketEvents.groupInvite(), { fromHeroId, toHeroId })) as SocketResponse;
    setIsLoading(false);
    if (!res.success) setGameMessage({ text: res.message, type: 'error' });
    if (res.success) setGameMessage({ text: res.message, type: 'success' });
  };

  return (
    <Button className="relative" disabled={isLoading} onClick={onInvite} variant={'outline'} size={'sm'}>
      {isLoading && (
        <BorderTrail
          style={{
            boxShadow: '0px 0px 60px 30px rgb(23 255 255 / 90%), 0 0 100px 60px rgb(0 0 0 / 50%), 0 0 140px 90px rgb(0 0 0 / 50%)',
          }}
          size={1}
        />
      )}
      <TextMorph>{isLoading ? 'wait...' : 'Invite'}</TextMorph>

      <CheckIcon className="text-green-500" />
    </Button>
  );
};
