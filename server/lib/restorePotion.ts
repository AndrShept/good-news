import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { heroTable, inventoryItemTable } from '../db/schema';

type PotionType = 'health' | 'mana';

interface IRestorePotion {
  currentHealth: number;
  currentMana: number;
  maxHealth: number;
  maxMana: number;
  restoreHealth: number;
  restoreMana: number;
  heroId: string;
  inventoryItemId: string;
  potionQuantity: number;
}

export const restorePotion = async ({
  currentHealth,
  currentMana,
  maxHealth,
  maxMana,
  restoreMana,
  restoreHealth,
  heroId,
  inventoryItemId,
  potionQuantity,
}: IRestorePotion) => {
  const restoredHealth = Math.min(maxHealth, currentHealth + restoreHealth);
  const restoredMana = Math.min(maxMana, currentMana + restoreMana);

  await db.transaction(async (tx) => {
    await tx
      .update(heroTable)
      .set({
        currentHealth: restoredHealth,
        currentMana: restoredMana,
      })
      .where(eq(heroTable.id, heroId));
    if (potionQuantity > 1) {
      await tx
        .update(inventoryItemTable)
        .set({
          quantity: potionQuantity - 1,
        })
        .where(eq(inventoryItemTable.id, inventoryItemId));
      return;
    }
    await tx.delete(inventoryItemTable).where(eq(inventoryItemTable.id, inventoryItemId));
  });
};
