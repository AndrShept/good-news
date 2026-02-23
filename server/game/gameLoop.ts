import { performance } from 'node:perf_hooks';

import { buffTick } from './buff-tick';
import { gatherTick } from './gather-tick';
import { moveTick } from './move-tick';
import { queueCraftTick } from './quue-craft-tick';
import { regenTick } from './regen-tick';
import { resourceRespawnTick } from './resource-respawn-tick';

const TICK_RATE = 1000; // ms
const MAX_CATCHUP_TICKS = 5;

let lastTick = Date.now();
let tickId = 0;

export const gameLoop = () => {
  const now = Date.now();
  const start = performance.now();

  let ticks = 0;

  while (now - lastTick >= TICK_RATE && ticks < MAX_CATCHUP_TICKS) {
    tickId++;

    moveTick(lastTick);
    buffTick(lastTick);
    queueCraftTick(lastTick);
    gatherTick(lastTick);
    resourceRespawnTick(lastTick)
    // regenTick(lastTick, TICK_RATE)

    lastTick += TICK_RATE;
    ticks++;
  }

  // якщо сервер відстав занадто сильно — скидаємо борг
  if (ticks === MAX_CATCHUP_TICKS) {
    lastTick = now;
  }

  const elapsed = performance.now() - start;
  if (elapsed > 50) {
    console.warn(`[TICK SLOW] ${elapsed.toFixed(2)}ms | ticks=${ticks}`);
  }

  setImmediate(gameLoop);
};
