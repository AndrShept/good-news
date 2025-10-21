import { type BuffCreateJob, jobName } from '@/shared/job-types';
import type { InventoryItem, Modifier, OmitModifier } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction, db } from '../db/db';
import { buffTable, heroTable, modifierTable } from '../db/schema';
import { sumModifier } from '../lib/sumModifier';
import { combineModifiers } from '../lib/utils';
import { actionQueue } from '../queue/actionQueue';

interface IDrinkPotion {
  isBuffPotion: boolean;
  inventoryItemPotion: InventoryItem;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  heroId: string;
  heroModifier: Modifier;
}

export const heroService = (db: TTransaction | TDataBase) => ({
  async incrementCurrentInventorySlots(heroId: string) {
    await db
      .update(heroTable)
      .set({
        currentInventorySlots: sql`${heroTable.currentInventorySlots} + 1`,
      })
      .where(eq(heroTable.id, heroId));
  },
  async decrementCurrentInventorySlots(heroId: string) {
    await db
      .update(heroTable)
      .set({
        currentInventorySlots: sql`${heroTable.currentInventorySlots} - 1`,
      })
      .where(eq(heroTable.id, heroId));
  },
  async spendGold(heroId: string, amount: number, heroCurrentGold: number) {
    if (heroCurrentGold < amount) throw new HTTPException(422, { message: 'You don’t have enough gold', cause: { canShow: true } });
    await db
      .update(heroTable)
      .set({ goldCoins: sql`${heroTable.goldCoins} - ${amount}` })
      .where(eq(heroTable.id, heroId));
  },

  async updateModifier(heroId: string, newModifier: OmitModifier) {
    await db
      .update(modifierTable)
      .set({ ...newModifier })
      .where(eq(modifierTable.heroId, heroId));
  },

  async drinkPotion({
    currentHealth,
    currentMana,
    heroId,
    inventoryItemPotion,
    isBuffPotion,
    maxHealth,
    maxMana,
    heroModifier,
  }: IDrinkPotion) {
    if (isBuffPotion) {
      const gameItemId = inventoryItemPotion.gameItem.potion?.buffInfo?.gameItemId ?? '';
      const duration = inventoryItemPotion.gameItem.potion?.buffInfo?.duration ?? 0;
      const modifier = inventoryItemPotion.gameItem.potion?.buffInfo?.modifier ?? {};
      const name = inventoryItemPotion.gameItem.potion?.buffInfo?.name ?? '';
      const image = inventoryItemPotion.gameItem.potion?.buffInfo?.image ?? '';
      const completedAt = new Date(Date.now() + duration).toISOString();
      const jobId = `buffId-${gameItemId}-heroId-${heroId}`;
      const jobData: BuffCreateJob = {
        jobName: 'BUFF_CREATE',
        payload: { heroId, gameItemId },
      };

      const findExistBuff = await db.query.buffTable.findFirst({
        where: and(eq(buffTable.heroId, heroId), eq(buffTable.gameItemId, gameItemId)),
      });
      if (findExistBuff) {
        await db
          .update(buffTable)
          .set({ completedAt: new Date(Date.now() + duration).toISOString() })
          .where(and(eq(buffTable.heroId, heroId), eq(buffTable.gameItemId, gameItemId)));

        await actionQueue.remove(jobId);
        await actionQueue.add(jobName['buff-create'], jobData, {
          delay: duration,
          jobId,
          removeOnComplete: true,
        });
        return;
      }
      const combinedModifier = combineModifiers(heroModifier, 'add', inventoryItemPotion.gameItem.potion?.buffInfo?.modifier!);
      await this.updateModifier(heroId, combinedModifier);
      await db.insert(buffTable).values({
        type: 'POSITIVE',
        modifier,
        name,
        image,
        duration,
        completedAt,
        heroId,
        gameItemId,
      });

      await actionQueue.add(jobName['buff-create'], jobData, {
        delay: 10000,
        jobId,
        removeOnComplete: true,
      });
    } else {
      const restoredHealth = Math.min(maxHealth, currentHealth + (inventoryItemPotion.gameItem.potion?.restore?.health ?? 0));
      const restoredMana = Math.min(maxMana, currentMana + (inventoryItemPotion.gameItem.potion?.restore?.mana ?? 0));
      await db
        .update(heroTable)
        .set({
          currentHealth: restoredHealth,
          currentMana: restoredMana,
        })
        .where(eq(heroTable.id, heroId));
    }
  },
});
