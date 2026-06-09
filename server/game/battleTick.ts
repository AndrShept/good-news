import type { BattleAction } from '@/shared/types';

import { generateRandomUuid } from '../lib/utils';
import { battleService } from '../services/battle-service';
import { creatureService } from '../services/creature-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const battleTick = (now: number) => {
  for (const battle of serverState.battle.values()) {
    if (battle.roundEndsAt <= now) {
      const allCreatures = battle.participants.filter((p) => p.type === 'CREATURE');
      for (const creature of allCreatures) {
        if (!creature.targetId) continue;
        battleService.createCreatureActionPending(battle, creature, creature.targetId);
      }
      const allNotActionParticipant = battle.participants.filter(
        (p) => !battle.pendingActions.some((a) => a.actionType === 'NORMAL' && a.participantId === p.id),
      );
      for (const participant of allNotActionParticipant) {
        const newAction: BattleAction = {
          id: generateRandomUuid(),
          actionType: 'NORMAL',
          category: 'PHYSICAL_ATTACK',
          participantId: participant.id,
          targetId: participant.targetId!,
          attackingZone: { LEFT_HAND: null, RIGHT_HAND: null },
          defenseZone: null,
        };
        battle.pendingActions.push(newAction);
      }

      battle.currentRound++;
      battle.roundEndsAt = battleService.getRoundDuration(battle.participants.length);
      socketService.sendToClientBattleUpdate(battle.id, {
        type: 'BATTLE_UPDATE',
        payload: {
          currentRound: battle.currentRound,
          roundEndsAt: battle.roundEndsAt,
        },
      });
    }

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
      if (participant.currentHealth <= 0 && !participant.isDead) {
        battleService.onParticipantDead(participant, battle);
      }
      const aliveAttackers = battle.participants.filter((p) => p.side === 'ATTACKER' && !p.isDead);
      const aliveDefenders = battle.participants.filter((p) => p.side === 'DEFENDER' && !p.isDead);
      if (!aliveAttackers.length || !aliveDefenders.length) {
        battleService.finishBattle(battle, now);
      }
    }
  }
};
