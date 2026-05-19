import { useSocket } from '@/components/providers/SocketProvider';
import { BattleSocketEvent } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useEffect } from 'react';

import { useBattleUpdate } from './useBattleUpdate';

export const useBattleListener = () => {
  const { socket } = useSocket();
  const { updateBattle, updateParticipant, addParticipant, addLog, addPendingAction, removePendingAction } = useBattleUpdate();

  useEffect(() => {
    const updateBattleListener = (data: BattleSocketEvent) => {
      switch (data.type) {
        case 'BATTLE_UPDATE':
          updateBattle(data.payload);
          break;
        case 'PARTICIPANT_UPDATE':
          for (const participant of data.payload) {
            if (!participant.id) continue;
            updateParticipant(participant.id, participant);
          }
          break;
        case 'PARTICIPANT_ADD':
          addParticipant(data.payload);
          break;
        case 'ACTIONS_ADD':
          addPendingAction(data.payload);
          break;
        case 'ACTIONS_REMOVE':
          for (const actionId of data.payload) {
            removePendingAction(actionId);
          }
          break;
        case 'LOG_ADD':
          for (const log of data.payload) {
            addLog(log);
          }
          break;
      }
    };

    socket.on(socketEvents.battleUpdate(), updateBattleListener);
    return () => {
      socket.off(socketEvents.battleUpdate(), updateBattleListener);
    };
  }, [addLog, addParticipant, socket, updateBattle, updateParticipant]);
};
