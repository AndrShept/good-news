import { serverState } from './state/server-state';

export const battleTick = (now: number) => {
  for (const [battleId, battle] of serverState.battle.entries()) {
    for (const action of battle.pendingActions) {
        
    }
  }
};
