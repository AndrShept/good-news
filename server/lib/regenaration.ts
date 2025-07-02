import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

interface IRegeneration {
  socket: Socket;
  heroId: string;
}
export const regeneration = async ({ socket, heroId }: IRegeneration) => {
  const timer = setInterval(async () => {
    const hero = await db.query.heroTable.findFirst({
      where: eq(heroTable.id, heroId),
    });
    const healthAmount = 1;
    if (!hero) return;
    const isFullHealth = hero.currentHealth >= hero.maxHealth;

    if (isFullHealth) {
      clearImmediate(timer);
      return;
    }
    await db
      .update(heroTable)
      .set({
        currentHealth: hero.currentHealth + healthAmount,
      })
      .where(eq(heroTable.id, hero.id));
    socket.emit('health', healthAmount);
  }, 1000);
  socket.on('disconnect', () => {
    clearImmediate(timer);
  });
};
