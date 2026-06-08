import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';

import { participantTurn } from '../api/participant-turn';

export const useParticipantTurnMutation = () => {
  const { updateHero } = useHeroUpdate();
  const setGameMessage = useSetGameMessage();
  return useMutation({
    mutationFn: ({ attackingZone, defenseZone, targetId, heroId }: Parameters<typeof participantTurn>[0]) =>
      participantTurn({ attackingZone, defenseZone, heroId, targetId }),
    onSuccess: ({ message }) => {
      //   setGameMessage({
      //     color: 'YELLOW',
      //     text: message,
      //   });
    },
  });
};
