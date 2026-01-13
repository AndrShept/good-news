import { calculate } from '../../lib/calculate';
import { type BuffCreateJob, jobName } from '@/shared/job-types';
import type { Hero, IPosition, Modifier, OmitModifier } from '@/shared/types';
import { and, eq, sql } from 'drizzle-orm';
import type {} from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { buffInstanceTable, heroTable, locationTable, modifierTable } from '../db/schema';
import { serverState } from '../game/state/server-state';
import { newCombineModifier } from '../lib/utils';
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
type ColumnType = Partial<Record<keyof typeof heroTable.$inferSelect, boolean>>;
export const heroService = (db: TTransaction | TDataBase) => ({
  async getHero(id: string, options?: Parameters<typeof db.query.heroTable.findFirst>[0]): Promise<Hero> {
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
  async getHeroByColum<T extends ColumnType>(id: string, columns: T) {
    const hero = await db.query.heroTable.findFirst({
      where: eq(heroTable.id, id),
      columns,
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
    const { maxHealth, maxMana } = calculate.maxValues({ constitution, intelligence, bonusMaxHealth, bonusMaxMana });
    const heroState = serverState.getHeroState(heroId);
    const [returnValue] = await db
      .update(heroTable)
      .set({
        maxHealth,
        maxMana,
        currentHealth: sql`LEAST(${heroTable.currentHealth}, ${maxHealth})`,
        currentMana: sql`LEAST(${heroTable.currentMana}, ${maxMana})`,
      })
      .where(eq(heroTable.id, heroId))
      .returning({
        maxHealth: heroTable.maxHealth,
        maxMana: heroTable.maxMana,
        currentHealth: heroTable.currentHealth,
        currentMana: heroTable.currentMana,
      });
    heroState.currentHealth = returnValue.currentHealth;
    heroState.maxHealth = returnValue.maxHealth;
    heroState.currentMana = returnValue.currentMana;
    heroState.maxMana = returnValue.maxMana;
  },
  getHeroStatsWithModifiers(heroId: string) {
    const { buffs, equipments } = serverState.getHeroState(heroId);
    const coreMaterialModifiers: Partial<OmitModifier>[] = [];
    const hero = serverState.getHeroState(heroId);
    // for (const item of equipments) {
    //   const coreMaterialModifier = craftItemService(db).getMaterialModifier(item.gameItem, item.gameItem.coreMaterial);
    //   if (coreMaterialModifier) {
    //     coreMaterialModifiers.push(coreMaterialModifier);
    //   }
    // }

    const modifiers = [
      ...buffs.map((b) => b.buffTemplate?.modifier),
      ...equipments.map((e) => e.itemTemplate?.coreModifier),
      ...coreMaterialModifiers,
    ];

    const newModifier = newCombineModifier(...modifiers);
    const sumStatAndModifier = newCombineModifier(newModifier, hero?.stat);

    return {
      newModifier,
      sumStatAndModifier,
    };
  },

  async updateModifier(heroId: string) {
    const { newModifier, sumStatAndModifier } = this.getHeroStatsWithModifiers(heroId);
    const hero = serverState.getHeroState(heroId);
     this.updateHeroMaxValues({
      bonusMaxHealth: sumStatAndModifier.maxHealth,
      bonusMaxMana: sumStatAndModifier.maxMana,
      constitution: sumStatAndModifier.constitution,
      intelligence: sumStatAndModifier.intelligence,
      heroId,
    });
    const [returningModifier] = await db.update(modifierTable).set(newModifier).where(eq(modifierTable.heroId, heroId)).returning();
    hero.modifier = returningModifier;
  },
  async spendGold(heroId: string, amount: number, heroCurrentGold: number) {
    if (heroCurrentGold < amount) throw new HTTPException(422, { message: 'You don’t have enough gold', cause: { canShow: true } });
    const [newValue] = await db
      .update(heroTable)
      .set({ goldCoins: sql`${heroTable.goldCoins} - ${amount}` })
      .where(eq(heroTable.id, heroId))
      .returning({ goldCoins: heroTable.goldCoins });
    const heroState = serverState.getHeroState(heroId);
    heroState.goldCoins = newValue.goldCoins;
  },
  async spendPremCoin(heroId: string, amount: number, heroCurrentPremCoin: number) {
    if (heroCurrentPremCoin < amount)
      throw new HTTPException(422, { message: 'You don’t have enough premium coin', cause: { canShow: true } });
    const [newValue] = await db
      .update(heroTable)
      .set({ premiumCoins: sql`${heroTable.premiumCoins} - ${amount}` })
      .where(eq(heroTable.id, heroId))
      .returning({ premiumCoins: heroTable.premiumCoins });
    const heroState = serverState.getHeroState(heroId);
    heroState.premiumCoins = newValue.premiumCoins;
    return newValue.premiumCoins;
  },

  async drinkPotion({ currentHealth, currentMana, heroId, inventoryItemPotion, isBuffPotion, maxHealth, maxMana }: IDrinkPotion) {
    // if (isBuffPotion) {
    //   const gameItemId = inventoryItemPotion?.gameItem?.potion?.buffInfo?.gameItemId ?? '';
    //   const delay = inventoryItemPotion?.gameItem?.potion?.buffInfo?.duration ?? 0;
    //   const modifier = inventoryItemPotion?.gameItem?.potion?.buffInfo?.modifier ?? {};
    //   const name = inventoryItemPotion?.gameItem?.potion?.buffInfo?.name ?? '';
    //   const image = inventoryItemPotion?.gameItem?.potion?.buffInfo?.image ?? '';
    //   const completedAt = new Date(Date.now() + delay).toISOString();
    //   const jobId = `buffId-${gameItemId}-heroId-${heroId}`;
    //   const jobData: BuffCreateJob = {
    //     jobName: 'BUFF_CREATE',
    //     payload: { heroId, gameItemId },
    //   };
    //   const findExistBuff = await db.query.buffInstanceTable.findFirst({
    //     where: and(eq(buffInstanceTable.ownerHeroId, heroId), eq(buffInstanceTable.gameItemId, gameItemId)),
    //   });
    //   if (findExistBuff) {
    //     await db
    //       .update(buffInstanceTable)
    //       .set({ expiresAt: new Date(Date.now() + delay).toISOString() })
    //       .where(and(eq(buffInstanceTable.ownerHeroId, heroId), eq(buffInstanceTable.buffTemplateId, gameItemId)));
    //     await actionQueue.remove(jobId);
    //     await actionQueue.add(jobName['buff-create'], jobData, {
    //       delay,
    //       jobId,
    //       removeOnComplete: true,
    //     });
    //     return;
    //   }
    //   await db.insert(buffInstanceTable).values({
    //     type: 'POSITIVE',
    //     modifier,
    //     name,
    //     image,
    //     duration: delay,
    //     completedAt,
    //     heroId,
    //     gameItemId,
    //   });
    //   await this.updateModifier(heroId);
    //   await actionQueue.add(jobName['buff-create'], jobData, {
    //     delay,
    //     jobId,
    //     removeOnComplete: true,
    //   });
    // } else {
    //   const restoredHealth = Math.min(maxHealth, currentHealth + (inventoryItemPotion?.gameItem?.potion?.restore?.health ?? 0));
    //   const restoredMana = Math.min(maxMana, currentMana + (inventoryItemPotion?.gameItem?.potion?.restore?.mana ?? 0));
    //   await db
    //     .update(heroTable)
    //     .set({
    //       currentHealth: restoredHealth,
    //       currentMana: restoredMana,
    //     })
    //     .where(eq(heroTable.id, heroId));
    // }
  },

  async walkMapCOmplete(heroId: string, pos: IPosition) {
    await db.update(heroTable).set({ state: 'IDLE' }).where(eq(heroTable.id, heroId));
    await db.update(locationTable).set({ x: pos.x, y: pos.y, targetX: null, targetY: null }).where(eq(locationTable.heroId, heroId));
  },
});
