import { buildingName } from '@/components/TownBuilding';
import { useSocket } from '@/components/providers/SocketProvider';
import { socketEvents } from '@/shared/socket-events';
import { WalkTownJobData } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useHeroChange } from './useHeroChange';

export const useWalkTownCompleteListener = () => {
  const { socket } = useSocket();
  const setGameMessage = useSetGameMessage();
  const { heroChange } = useHeroChange();

  useEffect(() => {
    const listener = (jobData: WalkTownJobData) => {
      const { buildingType } = jobData;
      heroChange({
        action: {
          type: 'IDLE',
        },
        location: {
          buildingType,
        },
      });
      setGameMessage({
        type: 'success',
        text: `You have entered the ${buildingName[buildingType]}.`,
      });
    };

    socket.on(socketEvents.actionWalkTownComplete(), listener);
  }, [socket]);
};
