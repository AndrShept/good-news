import { useSocket } from '@/components/providers/SocketProvider';
import { getSkillsOptions } from '@/features/skill/api/get-skills';
import { useSkillUpdate } from '@/features/skill/hooks/useSkillUpdate';
import { SelfHeroData } from '@/shared/socket-data-types';
import { socketEvents } from '@/shared/socket-events';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useEffect } from 'react';

import { useBuff } from './useBuff';
import { useHeroId } from './useHeroId';
import { useHeroUpdate } from './useHeroUpdate';

export const useHeroListener = () => {
  const { socket } = useSocket();
  const { removeBuff } = useBuff();
  const { updateHero } = useHeroUpdate();
  const { updateSkill } = useSkillUpdate();
  const heroId = useHeroId();
  const setGameMessage = useSetGameMessage();
  useEffect(() => {
    const listener = async (data: SelfHeroData) => {
      switch (data.type) {
        case 'REMOVE_BUFF':
          updateHero({ ...data.payload.hero });
          removeBuff(data.payload.buffInstanceId);
          break;
        case 'SKILL_UP':
          updateSkill(data.payload.skill.id, data.payload.skill);
          setGameMessage({ type: 'SKILL_EXP', text: data.payload.message, expAmount: data.payload.expAmount });
          break;
        case 'UPDATE_STATE':
          updateHero({ state: data.payload.state });
          break;
      }
    };

    socket.on(socketEvents.selfData(), listener);

    return () => {
      socket.off(socketEvents.selfData(), listener);
    };
  }, [heroId, removeBuff, setGameMessage, socket, updateHero, updateSkill]);
};
