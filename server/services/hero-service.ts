import { type BuffCreateJob, jobName } from '@/shared/job-types';
import type {  ContainerSlot, Hero, Modifier, OmitModifier } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import type {} from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { buffTable, heroTable, modifierTable } from '../db/schema';
import { getHeroStatsWithModifiers } from '../lib/getHeroStatsWithModifiers';
import { calculateMaxValues } from '../lib/utils';
import { actionQueue } from '../queue/actionQueue';

interface IDrinkPotion {
  isBuffPotion: boolean;
  inventoryItemPotion: ContainerSlot;
  maxHealth: number;
  currentHealth: number;
  maxMana: number;
  currentMana: number;
  heroId: string;
}

interface IUpdateHeroMaxValues {
  heroId: string;
  constitution: number;
  intelligence: number;
  bonusMaxMana: number;
  bonusMaxHealth: number;
}

export const heroService = (db: TTransaction | TDataBase) => ({
  async getHero(id: string, options?:  Parameters<typeof db.query.heroTable.findFirst>[0]): Promise<Hero> {
    const hero = await db.query.heroTable.findFirst({
      where: eq(heroTable.id, id),
      ...options,
    });
    if (!hero) {
      throw new HTTPException(404, {
        message: 'hero not found',
      });
    }
    return hero;
  },
  async updateHeroMaxValues(data: IUpdateHeroMaxValues) {
    const { constitution, heroId, intelligence, bonusMaxHealth, bonusMaxMana } = data;
    const { maxHealth, maxMana } = calculateMaxValues({ constitution, intelligence, bonusMaxHealth, bonusMaxMana });

    await db
      .update(heroTable)
      .set({
        maxHealth,
        maxMana,
        currentHealth: sql`LEAST(${heroTable.currentHealth}, ${maxHealth})`,
        currentMana: sql`LEAST(${heroTable.currentMana}, ${maxMana})`,
      })
      .where(eq(heroTable.id, heroId));
  },
  async updateModifier(heroId: string) {
    const { newModifier, sumStatAndModifier } = await getHeroStatsWithModifiers(db, heroId);
    await this.updateHeroMaxValues({
      bonusMaxHealth: sumStatAndModifier.maxHealth,
      bonusMaxMana: sumStatAndModifier.maxMana,
      constitution: sumStatAndModifier.constitution,
      intelligence: sumStatAndModifier.intelligence,
      heroId,
    });
    await db.update(modifierTable).set(newModifier).where(eq(modifierTable.heroId, heroId));
  },
  async spendGold(heroId: string, amount: number, heroCurrentGold: number) {
    if (heroCurrentGold < amount) throw new HTTPException(422, { message: 'You don’t have enough gold', cause: { canShow: true } });
    await db
      .update(heroTable)
      .set({ goldCoins: sql`${heroTable.goldCoins} - ${amount}` })
      .where(eq(heroTable.id, heroId));
  },

  async drinkPotion({ currentHealth, currentMana, heroId, inventoryItemPotion, isBuffPotion, maxHealth, maxMana }: IDrinkPotion) {
    if (isBuffPotion) {
      const gameItemId = inventoryItemPotion?.gameItem?.potion?.buffInfo?.gameItemId ?? '';
      const delay = inventoryItemPotion?.gameItem?.potion?.buffInfo?.duration ?? 0;
      const modifier = inventoryItemPotion?.gameItem?.potion?.buffInfo?.modifier ?? {};
      const name = inventoryItemPotion?.gameItem?.potion?.buffInfo?.name ?? '';
      const image = inventoryItemPotion?.gameItem?.potion?.buffInfo?.image ?? '';
      const completedAt = new Date(Date.now() + delay).toISOString();
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
          .set({ completedAt: new Date(Date.now() + delay).toISOString() })
          .where(and(eq(buffTable.heroId, heroId), eq(buffTable.gameItemId, gameItemId)));

        await actionQueue.remove(jobId);
        await actionQueue.add(jobName['buff-create'], jobData, {
          delay,
          jobId,
          removeOnComplete: true,
        });
        return;
      }

      await db.insert(buffTable).values({
        type: 'POSITIVE',
        modifier,
        name,
        image,
        duration: delay,
        completedAt,
        heroId,
        gameItemId,
      });
      await this.updateModifier(heroId);

      await actionQueue.add(jobName['buff-create'], jobData, {
        delay,
        jobId,
        removeOnComplete: true,
      });
    } else {
      const restoredHealth = Math.min(maxHealth, currentHealth + (inventoryItemPotion?.gameItem?.potion?.restore?.health ?? 0));
      const restoredMana = Math.min(maxMana, currentMana + (inventoryItemPotion?.gameItem?.potion?.restore?.mana ?? 0));
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
