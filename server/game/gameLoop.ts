import { performance } from 'node:perf_hooks';

import { heroTickService } from '../services/hero-tick-service';
import { battleTick } from './battleTick';
import { resourceRespawnTick } from './resource-respawn-tick';
import { spawnCreatureTick } from './spawn-creature-tick';

const TICK_RATE = 500; // ms
const MAX_CATCHUP_TICKS = 5;

let lastTick = Date.now();
let tickId = 0;

export const gameLoop = () => {
  const now = Date.now();
  const start = performance.now();

  let ticks = 0;

  while (now - lastTick >= TICK_RATE && ticks < MAX_CATCHUP_TICKS) {
    tickId++;

    // moveTick(lastTick);
    // queueCraftTick(lastTick);
    // gatherTick(lastTick);
    // refineTick(lastTick);
    // regenTick(lastTick, TICK_RATE)
    heroTickService.heroTick(lastTick, TICK_RATE);
    // buffTick(lastTick);
    resourceRespawnTick(lastTick);
    spawnCreatureTick(lastTick);
    battleTick(lastTick);

    lastTick += TICK_RATE;
    ticks++;
  }

  // якщо сервер відстав занадто сильно — скидаємо борг
  if (ticks === MAX_CATCHUP_TICKS) {
    lastTick = now;
  }

  const elapsed = performance.now() - start;
  if (elapsed > 50) {
    console.warn(`[TICK SLOW ${new Date().toLocaleTimeString()}] ${elapsed.toFixed(2)}ms | ticks=${ticks}`);
  }

  setImmediate(gameLoop);
};
