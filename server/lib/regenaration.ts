import { BASE_HEALTH_REGEN_TIME, BASE_MANA_REGEN_TIME } from '@/shared/constants';
import { eq } from 'drizzle-orm';
import type { Socket } from 'socket.io';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

interface IRegeneration {
  socket: Socket;
  heroId?: string;
}
export const regeneration = async ({ socket }: IRegeneration) => {
  let manaTimer: NodeJS.Timeout;
  let healthTimer: NodeJS.Timeout;

  socket.on('go-health', async (id) => {
    const hero = await db.query.heroTable.findFirst({
      where: eq(heroTable.id, id),
      with: { modifier: true },
    });
    if (!hero) return;
    const constitution = hero.modifier?.constitution ?? 0;
    const strength = hero.modifier?.strength ?? 0;
    const healthRegenerationTime = BASE_HEALTH_REGEN_TIME - (constitution * 30 + strength * 10);
    console.log('healthRegenerationTime', healthRegenerationTime);
    clearInterval(healthTimer);
    healthTimer = setInterval(async () => {
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });
      if (!hero) return;
      const isFullHealth = hero.currentHealth >= hero.maxHealth;

      if (isFullHealth) {
        clearInterval(healthTimer);
        return;
      }

      const [updatedValue] = await db
        .update(heroTable)
        .set({
          currentHealth: hero.currentHealth + 1,
        })
        .where(eq(heroTable.id, hero.id))
        .returning({ currentHealth: heroTable.currentHealth });
      socket.emit(`health-regeneration-${hero.id}`, updatedValue);
    }, healthRegenerationTime);
  });

  socket.on('go-mana', async (id) => {
    const hero = await db.query.heroTable.findFirst({
      where: eq(heroTable.id, id),
      with: { modifier: true },
    });
    if (!hero) return;
    const intelligence = hero.modifier?.intelligence ?? 0;
    const manaRegenerationTime = BASE_MANA_REGEN_TIME - intelligence * 40;
    console.log('manaRegenerationTime', manaRegenerationTime);
    clearInterval(manaTimer);
    manaTimer = setInterval(async () => {
      const hero = await db.query.heroTable.findFirst({
        where: eq(heroTable.id, id),
      });
      if (!hero) return;
      const isFullMana = hero.currentMana >= hero.maxMana;

      if (isFullMana) {
        clearInterval(manaTimer);
        return;
      }

      const [updatedValue] = await db
        .update(heroTable)
        .set({
          currentMana: hero.currentMana + 1,
        })
        .where(eq(heroTable.id, hero.id))
        .returning({ currentMana: heroTable.currentMana });
      socket.emit(`mana-regeneration-${id}`, updatedValue);
    }, manaRegenerationTime);
  });
  socket.on('disconnect', () => {
    clearInterval(healthTimer);
    clearInterval(manaTimer);
  });
};
