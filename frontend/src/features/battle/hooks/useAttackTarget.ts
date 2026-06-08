import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { useHeroUpdate } from '@/features/hero/hooks/useHeroUpdate';
import { MapChunkEntitiesType } from '@/shared/types';
import { useSetGameMessage } from '@/store/useGameMessages';
import { useMutation } from '@tanstack/react-query';

import { attackTarget } from '../api/attack-target';

export const useAttackTarget = () => {
  const heroId = useHeroId();
  const { updateHero } = useHeroUpdate();
  const setGameMessage = useSetGameMessage();
  return useMutation({
    mutationFn: ({ targetId, targetType }: { targetId: string; targetType: Extract<MapChunkEntitiesType, 'HERO' | 'CREATURE'> }) =>
      attackTarget({ heroId, targetId, targetType }),
    onSuccess: ({ message }) => {
      // updateHero({ ...data });
      setGameMessage({
        color: 'YELLOW',
        text: message,
      });
    },
  });
};
