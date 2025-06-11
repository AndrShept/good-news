
import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { heroTable, inventoryItemTable } from '../db/schema';

type PotionType = 'health' | 'mana';

interface IRestorePotion {
  currentValue: number;
  restorePotionValue: number;
  heroMaxValue: number;
  heroId: string;
  itemId: string;
  potionQuantity: number;
  type: PotionType;
}

export const restorePotion = async ({
  currentValue,
  heroMaxValue,
  restorePotionValue,
  heroId,
  itemId,
  potionQuantity,
  type,
}: IRestorePotion) => {
  const restoredValue = currentValue + restorePotionValue;
  await db.transaction(async (tx) => {
    await tx
      .update(heroTable)
      .set(
        type === 'health'
          ? {
              currentHealth: Math.min(restoredValue, heroMaxValue),
            }
          : {
              currentMana: Math.min(restoredValue, heroMaxValue),
            },
      )
      .where(eq(heroTable.id, heroId));
    if (potionQuantity > 1) {
      await tx
        .update(inventoryItemTable)
        .set({
          quantity: potionQuantity - 1,
        })
        .where(eq(inventoryItemTable.id, itemId));
      return;
    }
    await tx.delete(inventoryItemTable).where(eq(inventoryItemTable.id, itemId));
  });
};
