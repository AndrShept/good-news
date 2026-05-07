import { HTTPException } from 'hono/http-exception';

import { serverState } from '../game/state/server-state';

export const battleService = {
  getBattle(battleId: string) {
    const battle = serverState.battle.get(battleId);
    if (!battle) throw new HTTPException(400, { message: 'Battle not found' });
    return battle;
  },
  createBattle() {
    
  }
};
