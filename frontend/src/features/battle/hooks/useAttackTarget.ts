import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { MapChunkEntitiesType } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';

import { attackTarget } from '../api/attack-target';

export const useAttackTarget = () => {
  const heroId = useHeroId();
  return useMutation({
    mutationFn: ({ targetId, targetType }: { targetId: string; targetType: Extract<MapChunkEntitiesType, 'HERO' | 'CREATURE'> }) =>
      attackTarget({ heroId, targetId, targetType }),
    onSuccess: () => {
      
    }
  });
};
