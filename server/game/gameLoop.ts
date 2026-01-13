
import { moveTick } from './move-tick';
import { saveDb } from './save-db';

export const gameLoop =  () => {
  moveTick();
  // saveDb.walkMapComplete();
};
