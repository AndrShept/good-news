import type { BattlePendingAction } from '@/shared/battle-types';

import { generateRandomUuid } from '../lib/utils';
import { battleService } from '../services/battle-service';
import { serverState } from './state/server-state';

export const battleTick = (now: number) => {
  for (const battle of serverState.battle.values()) {
    if (battle.roundEndsAt <= now) {
      const allNotActionParticipant = battle.participants.filter((p) => !battle.pendingActions.some((a) => a.participantId === p.id));

      for (const participant of allNotActionParticipant) {
        const newAction: BattlePendingAction = {
          id: generateRandomUuid(),
          type: 'SKIP_ROUND',
          defenseZone: null,
          isResolved: false,
          attackingZone: {
            LEFT_HAND: null,

            RIGHT_HAND: null,
          },
          targetId: participant.targetId!,
          participantId: participant.id,
        };
        battle.pendingActions.push(newAction);
      }

      // battleService.setNextRound(battle);
    }

    for (const action of battle.pendingActions) {
      if (action.isResolved) continue;
      const attackerParticipant = battleService.getParticipant(battle, action.participantId);
      const targetParticipant = battleService.getParticipant(battle, action.targetId);
      const opponentAction = battle.pendingActions.find((a) => action.participantId === a.targetId);

      if (opponentAction) {
        battleService.resolveActionPair({
          battle,
          action,
          attackerParticipant,
          targetParticipant,
          targetDefenseZone: opponentAction.defenseZone,
        });
      }
    }

    if (battle.participants.length <= battle.pendingActions.length) {
      const resolvedActions = new Set(battle.pendingActions.filter((a) => a.isResolved));
      if (resolvedActions.size === battle.participants.length) {
        battleService.nextRound(battle);
      }
    }

    for (const participant of battle.participants) {
      if (participant.currentHealth <= 0 && !participant.isDead) {
        battleService.onParticipantDead(participant, battle);
      }
      if (
        participant.type === 'CREATURE' &&
        !participant.isDead &&
        !battle.pendingActions.some((a) => a.participantId === participant.id)
      ) {
        if (!participant.targetId) continue;

        battleService.createCreatureActionPending(battle, participant, participant.targetId);
      }

      const aliveAttackers = battle.participants.filter((p) => p.side === 'ATTACKER' && !p.isDead);
      const aliveDefenders = battle.participants.filter((p) => p.side === 'DEFENDER' && !p.isDead);
      if (!aliveAttackers.length || !aliveDefenders.length) {
        battleService.finishBattle(battle, now);
      }
    }
  }
};
