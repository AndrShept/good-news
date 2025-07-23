import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { SocketGroupResponse } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useRemoveGroup } from './useRemoveGroup';

export const useGroupListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const groupId = useHero((state) => state?.data?.groupId ?? '');
  const { socket } = useSocket();
  const { onRemove } = useRemoveGroup();

  useEffect(() => {
    const groupUpdatedListener = (data: SocketGroupResponse) => {
      if (data.updateType === 'remove') {
        onRemove();
      }
      setGameMessage({
        text: data.message,
        type: data.messageType ?? 'error',
      });
    };
    socket.on(socketEvents.groupUpdated(), groupUpdatedListener);
    return () => {
      socket.off(socketEvents.groupUpdated(), groupUpdatedListener);
    };
  }, [socket]);
  useEffect(() => {
    const groupSysMessagesListener = (data: SocketGroupResponse) => {
      setGameMessage({
        text: data.message,
        type: data.messageType ?? 'success',
      });
    };
    socket.on(socketEvents.groupSysMessages(), groupSysMessagesListener);
    return () => {
      socket.off(socketEvents.groupSysMessages(), groupSysMessagesListener);
    };
  }, [socket]);

  useEffect(() => {
    if (groupId) {
      socket.emit(socketEvents.joinRoom(), groupId, (cb: { accept: boolean }) => {
        if (cb.accept) {
          setGameMessage({
            text: `join group room ${groupId} `,
            type: 'info',
          });
        }
      });
    }
  }, [groupId, socket]);
};
