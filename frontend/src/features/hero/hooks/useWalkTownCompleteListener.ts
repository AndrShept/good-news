import { useSocket } from '@/components/providers/SocketProvider';
import { socketEvents } from '@/shared/socket-events';
import { WalkTownJobData } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useHeroChange } from './useHeroChange';
import { buildingName as building } from '@/features/town/components/TownBuilding';

export const useWalkTownCompleteListener = () => {
  const { socket } = useSocket();
  const setGameMessage = useSetGameMessage();
  const { heroChange } = useHeroChange();

  useEffect(() => {
    const listener = (jobData: WalkTownJobData) => {
      const { buildingName } = jobData;
      heroChange({
        action: {
          type: 'IDLE',
        },
        location: {
          currentBuilding: buildingName,
        },
      });
      setGameMessage({
        type: 'success',
        text: `You have entered the ${building[buildingName]}.`,
      });
    };

    socket.on(socketEvents.actionWalkTownComplete(), listener);
  }, [socket]);
};
