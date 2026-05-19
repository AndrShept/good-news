import { useHero } from '@/features/hero/hooks/useHero';
import { Battle, BattleAction, BattleLog, BattleParticipant } from '@/shared/types';
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
  const addPendingAction = (pendingAction: BattleAction) => {
    queryClient.setQueryData(getBattleOptions(hero.id, hero.battleId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, pendingActions: [...oldData.pendingActions, pendingAction] };
    });
  };
  const removePendingAction = (actionId: string) => {
    queryClient.setQueryData(getBattleOptions(hero.id, hero.battleId).queryKey, (oldData) => {
      if (!oldData) return;
      return { ...oldData, pendingActions: oldData.pendingActions.filter((a) => a.id !== actionId) };
    });
  };

  return {
    updateBattle,
    addParticipant,
    updateParticipant,
    addLog,
    addPendingAction,
    removePendingAction,
  };
};
