import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

interface IRegeneration {
  socket: Socket;
  heroId: string;
}
export const regeneration = async ({ socket, heroId }: IRegeneration) => {
  const hero = await db.query.heroTable.findFirst({
    where: eq(heroTable.id, heroId),
  });
  if (!hero) return;
  const isFullHealth = hero.currentHealth >= hero.maxHealth;
  const timer = setInterval(async () => {
    let health = 0;
    if (isFullHealth) {
      clearImmediate(timer);
    }
    const [updatedHero] = await db
      .update(heroTable)
      .set({
        currentHealth: health + hero.currentHealth,
      })
      .where(eq(heroTable.id, hero.id))
      .returning();
    socket.emit('health', updatedHero.currentHealth);
    health++;
  }, 1000);
};
