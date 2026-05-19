import { useHero } from '@/features/hero/hooks/useHero';
import { Battle, BattleLog, BattleParticipant } from '@/shared/types';
import { useQueryClient } from '@tanstack/react-query';

import { getBattleOptions } from '../api/get-battle';

export const useBattleUpdate = () => {
  const hero = useHero((data) => ({ id: data?.id ?? '', battleId: data?.battleId ?? '' }));
  const queryClient = useQueryClient();

  const updateBattle = (updateData: Partial<Pick<Battle, 'currentRound' | 'roundEndsAt' | 'status'>>) => {
    queryClient.setQueryData(getBattleOptions(hero.id, hero.battleId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, ...updateData };
    });
  };
  const addParticipant = (newParticipant: BattleParticipant) => {
    queryClient.setQueryData(getBattleOptions(hero.id, hero.battleId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, participants: [...oldData.participants, newParticipant] };
    });
  };
  const updateParticipant = (participantId: string, updateData: Partial<BattleParticipant>) => {
    queryClient.setQueryData(getBattleOptions(hero.id, hero.battleId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, participants: oldData.participants.map((p) => (p.id === participantId ? { ...p, ...updateData } : p)) };
    });
  };
  const addLog = (log: BattleLog) => {
    queryClient.setQueryData(getBattleOptions(hero.id, hero.battleId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, logs: [...oldData.logs, log] };
    });
  };

  return {
    updateBattle,
    addParticipant,
    updateParticipant,
    addLog,
  };
};
