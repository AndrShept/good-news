import { useSocket } from '@/components/providers/SocketProvider';
import { SelfHeroData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { getHeroOptions } from '../api/get-hero';
import { useBuff } from './useBuff';
import { getBuffOptions } from '../api/get-buff';
import { useHeroId } from './useHeroId';
import { useSetGameMessage } from '@/store/useGameMessages';
import { getSkillsOptions } from '@/features/skill/api/get-skills';


export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const heroId = useHeroId()
  const queryClient = useQueryClient();
  const setGameMessage = useSetGameMessage()
  useEffect(() => {
    const listener = async (data: SelfHeroData) => {
      switch (data.type) {
        case 'REMOVE_BUFF':
          queryClient.invalidateQueries({ queryKey: getHeroOptions().queryKey });
          removeBuff(data.payload.buffInstanceId);
          break;
        case 'SKILL_UP':
          queryClient.invalidateQueries({ queryKey: getSkillsOptions(heroId).queryKey });
          setGameMessage({ type: 'SKILL_EXP', text: data.payload.message })
          break
      }
    };

    socket.on(socketEvents.selfData(), listener);

    return () => {
      socket.off(socketEvents.selfData(), listener);
    };
  }, []);
};
