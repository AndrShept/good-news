import type { BattleAction } from '@/shared/battle-types';

import { generateRandomUuid } from '../lib/utils';
import { battleService } from '../services/battle-service';
import { creatureService } from '../services/creature-service';
import { socketService } from '../services/socket-service';
import { serverState } from './state/server-state';

export const battleTick = (now: number) => {
  for (const battle of serverState.battle.values()) {
    if (battle.roundEndsAt <= now) {
      const allNotActionParticipant = battle.participants.filter(
        (p) =>
          !battle.pendingActions.some(
            (a) => (a.category === 'PHYSICAL_ATTACK' || a.category === 'ABILITY') && a.actionType === 'NORMAL' && a.participantId === p.id,
          ),
      );

      for (const participant of allNotActionParticipant) {
        const newAction: BattleAction = {
          id: generateRandomUuid(),
          category: 'SKIP_ROUND',
          defenseZone: null,
          targetId: participant.targetId!,
          participantId: participant.id,
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
      const attackerParticipant = battleService.getParticipant(battle, action.participantId);
      const targetParticipant = battleService.getParticipant(battle, action.targetId);
      const opponentAction = battleService.findOpponentAction(battle, action);
      switch (action.category) {
        case 'ABILITY':
        case 'PHYSICAL_ATTACK': {
          if (opponentAction) {
            battleService.resolveActionPair({
              battle,
              action,
              attackerParticipant,
              targetParticipant,
              targetDefenseZone: opponentAction.defenseZone,
            });
          }
          break;
        }
        case 'SKIP_ROUND':
          if (opponentAction) {
            battleService.resolveActionPair({
              battle,
              action,
              attackerParticipant,
              targetParticipant,
              targetDefenseZone: opponentAction.defenseZone,
            });
          }

          break;
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
