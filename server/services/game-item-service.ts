import { eq } from 'drizzle-orm';

import type { TDataBase, TTransaction } from '../db/db';
import { armorTable, gameItemTable, weaponTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';

export const gameItemService = (db: TTransaction | TDataBase) => ({
  async createGameItem(gameItemId: string) {
    const recipeItem = await db.query.gameItemTable.findFirst({
      where: eq(gameItemTable.id, gameItemId),
      with: {
        weapon: true,
        armor: true,
        potion: true,
        accessory: true,
      },
    });
    if (!recipeItem) throw new Error('recipeItem not found');
    const { accessory, armor, createdAt, id, weapon, price, potion, ...gameItemData } = recipeItem;
    const [newGameItem] = await db
      .insert(gameItemTable)
      .values({
        ...gameItemData,

        id: generateRandomUuid(),
      })
      .returning();
    switch (recipeItem.type) {
      case 'WEAPON':
        await db.insert(weaponTable).values({
          ...weapon!,
          gameItemId: newGameItem.id,
          id: generateRandomUuid(),
        });
        break;
      case 'ARMOR':
        await db.insert(armorTable).values({
          ...armor!,
          gameItemId: newGameItem.id,
          id: generateRandomUuid(),
        });
        break;
    }

    return newGameItem;
  },
});
