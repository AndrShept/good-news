import { useSocket } from '@/components/providers/SocketProvider';
import { useChangeMap } from '@/features/map/hooks/useChangeMap';
import { socketEvents } from '@/shared/socket-events';
import { WalkMapJobData } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useHero } from './useHero';
import { useHeroChange } from './useHeroChange';
import { useHeroId } from './useHeroId';

export const useWalkMapCompleteListener = () => {
  const { socket } = useSocket();

  const mapId = useHero((state) => state?.data?.location?.mapId ?? '');
  const setGameMessage = useSetGameMessage();
  const { heroChange } = useHeroChange();
  const { filterHeroes, addHeroes } = useChangeMap(mapId);
  const id = useHeroId();

  useEffect(() => {
    const listener = (jobData: WalkMapJobData) => {
      const { tile, targetTileId, currentTileId, hero } = jobData;
      console.log(jobData);
      if (id === hero.id) {
        heroChange({
          action: {
            type: 'IDLE',
          },
          tile,
          tileId: targetTileId,
        });
      }

      filterHeroes({ tileId: currentTileId, heroId: hero.id });
      addHeroes({ tileId: targetTileId, hero });
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
