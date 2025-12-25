import { useSocket } from '@/components/providers/SocketProvider';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { SocketGroupResponse } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useGameMessages } from '@/store/useGameMessages';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { getGroupAvailableHeroesOptions } from '../api/get-group-available-heroes';
import { useRemoveGroup } from './useRemoveGroup';

export const useGroupListener = () => {
  const setGameMessage = useGameMessages((state) => state.setGameMessage);
  const groupId = useHero((data) => data?.groupId ?? '');
  const selfId = useHeroId();
  const { socket } = useSocket();
  const { onRemove } = useRemoveGroup();
  const queryClient = useQueryClient();

  const prevGroupIdRef = useRef<string | null>(null);
  useEffect(() => {
    const groupUpdatedListener = async (data: SocketGroupResponse) => {
      if (data.updateType === 'remove') {
        onRemove();
      }
      if (data.updateType === 'kick' || data.updateType === 'leave') {
        if (data.memberId === selfId) {
          onRemove();
        }
        await queryClient.invalidateQueries({
          queryKey: ['group'],
        });
        await queryClient.invalidateQueries({
          queryKey: getGroupAvailableHeroesOptions({ searchTerm: '', selfId }).queryKey,
        });
      }

      setGameMessage({
        text: data.message,
        type: data.messageType ?? 'ERROR',
      });
    };
    socket.on(socketEvents.groupUpdated(), groupUpdatedListener);
    return () => {
      socket.off(socketEvents.groupUpdated(), groupUpdatedListener);
    };
  }, [onRemove, selfId, setGameMessage, socket]);
  useEffect(() => {
    const groupSysMessagesListener = (data: SocketGroupResponse) => {
      setGameMessage({
        text: data.message,
        type: data.messageType ?? 'SUCCESS',
      });
    };
    socket.on(socketEvents.groupSysMessages(), groupSysMessagesListener);
    return () => {
      socket.off(socketEvents.groupSysMessages(), groupSysMessagesListener);
    };
  }, [setGameMessage, socket]);

  useEffect(() => {
    if (groupId) {
      socket.emit(socketEvents.joinRoom(), groupId, (cb: { accept: boolean }) => {
        if (cb.accept) {
          setGameMessage({
            text: `join group room ${groupId} `,
            type: 'INFO',
          });
        }
      });
      prevGroupIdRef.current = groupId;
    }
    if (prevGroupIdRef.current && !groupId) {
      socket.emit(socketEvents.leaveRoom(), prevGroupIdRef.current, (cb: { accept: boolean }) => {
        if (cb.accept) {
          setGameMessage({
            text: `left group room ${prevGroupIdRef.current}`,
            type: 'INFO',
          });
        }
      });
    }
  }, [groupId, setGameMessage, socket]);
};
