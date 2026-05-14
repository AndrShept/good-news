import { battleService } from '../services/battle-service';
import { serverState } from './state/server-state';

export const battleTick = (now: number) => {
  for (const [battleId, battle] of serverState.battle.entries()) {
    for (const action of battle.pendingActions) {
      const findResolveActionOpponent = battle.pendingActions.find(
        (a) =>
          a.participantId === action.targetId &&
          a.targetId == action.participantId &&
          action.actionType === 'NORMAL' &&
          a.actionType === 'NORMAL',
      );
      if (findResolveActionOpponent) {
        console.log('findResolveActionOpponent');
        battleService.resolveActionPair(battle, action, findResolveActionOpponent);
      }
    }
  }
};
