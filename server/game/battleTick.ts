import { battleService } from '../services/battle-service';
import { creatureService } from '../services/creature-service';
import { serverState } from './state/server-state';

export const battleTick = (now: number) => {
  for (const battle of serverState.battle.values()) {
    for (const action of battle.pendingActions) {
      const targetParticipant = battleService.getParticipant(battle, action.targetId);
      if (targetParticipant.type === 'CREATURE') {
        battleService.createCreatureActionPending(battle, targetParticipant, action.participantId);
      }
      const findResolveActionOpponent = battle.pendingActions.find(
        (a) =>
          a.participantId === action.targetId &&
          a.targetId == action.participantId &&
          action.actionType === 'NORMAL' &&
          a.actionType === 'NORMAL',
      );
      if (findResolveActionOpponent) {
        battleService.resolveActionPair(battle, action, findResolveActionOpponent);
      }
    }

    for (const participant of battle.participants) {
      if (participant.currentHealth <= 0) {
        battleService.onParticipantDead(participant, battle);

        const aliveAttackers = battle.participants.filter((p) => p.side === 'ATTACKER' && !p.isDead);
        const aliveDefenders = battle.participants.filter((p) => p.side === 'DEFENDER' && !p.isDead);

        if (!aliveAttackers.length || !aliveDefenders.length) {
          battleService.finishBattle(battle, now);
        }
      }
    }
  }
};
