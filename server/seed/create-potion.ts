import { db } from '../db/db';
import { gameItemTable, potionTable } from '../db/schema';
import { potionEntities } from '../entities/potions';

export const createPotions = async () => {
  const potions = Object.values(potionEntities);
  for (const potion of potions) {
    const [newPotion] = await db.insert(gameItemTable).values(potion).returning({ id: gameItemTable.id });
    await db.insert(potionTable).values({
      type: potion.potion.type,
      gameItemId: newPotion.id,
      buffInfo: { ...potion.potion.buffInfo, gameItemId: newPotion.id },
      restore: potion.potion.restore,
    });
  }
  console.log('✔ potions create');
  return;
};
createPotions();
