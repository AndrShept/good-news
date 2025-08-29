import { useSocket } from '@/components/providers/SocketProvider';
import { socketEvents } from '@/shared/socket-events';
import { WalkMapJobData } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useHeroChange } from './useHeroChange';

export const useWalkMapCompleteListener = () => {
  const { socket } = useSocket();
  const setGameMessage = useSetGameMessage();
  const { heroChange } = useHeroChange();

  useEffect(() => {
    const listener = (jobData: WalkMapJobData) => {
      const { tile, tileId } = jobData;
      console.log(jobData);
      heroChange({
        action: {
          type: 'IDLE',
        },
        tile,
        tileId,
      });
      setGameMessage({
        type: 'success',
        text: `You have entered tile.`,
      });
    };

    socket.on(socketEvents.actionWalkMapComplete(), listener);

    return () => {
      socket.off(socketEvents.actionWalkMapComplete(), listener);
    };
  }, [socket]);
};
