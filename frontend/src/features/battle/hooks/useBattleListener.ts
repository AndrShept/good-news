import { useSocket } from '@/components/providers/SocketProvider';
import { BattleUpdateData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useEffect } from 'react';

import { useBattleUpdate } from './useBattleUpdate';

export const useBattleListener = () => {
  const { socket } = useSocket();
  const { updateBattle, updateParticipant, addParticipant, addLog } = useBattleUpdate();

  useEffect(() => {
    const updateBattleListener = (data: BattleUpdateData) => {
      for (const participant of data.participants) {
        if (!participant.id) continue;
        updateParticipant(participant.id, participant);
      }
      for (const log of data.logs) {
        addLog(log);
      }
    };

    socket.on(socketEvents.battleUpdate(), updateBattleListener);
    return () => {
      socket.off(socketEvents.battleUpdate(), updateBattleListener);
    };
  }, [addLog, socket, updateParticipant]);
};
