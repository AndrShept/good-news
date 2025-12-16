import type { GameItem } from '@/shared/types';
import { eq } from 'drizzle-orm';
import { HTTPException } from 'hono/http-exception';

import type { TDataBase, TTransaction } from '../db/db';
import { armorTable, gameItemTable, shieldTable, weaponTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';

export const gameItemService = (db: TTransaction | TDataBase) => ({
  async getGameItem(gameItemId: string, options?: Parameters<typeof db.query.gameItemTable.findFirst>[0]): Promise<GameItem> {
    const gameItem = await db.query.gameItemTable.findFirst({
      where: eq(gameItemTable.id, gameItemId),
      ...options,
    });
    if (!gameItem) {
      throw new HTTPException(404, { message: 'game item not found' });
    }
    return gameItem;
  },
  async createGameItem(gameItemId: string) {
    const recipeItem = await db.query.gameItemTable.findFirst({
      where: eq(gameItemTable.id, gameItemId),
      with: {
        weapon: true,
        armor: true,
        shield: true,
        potion: true,
        accessory: true,
      },
    });
    if (!recipeItem) throw new Error('recipeItem not found');
    const { accessory, armor, shield, createdAt, id, weapon, price, potion, ...gameItemData } = recipeItem;
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
      case 'SHIELD':
        await db.insert(shieldTable).values({
          ...shield!,
          gameItemId: newGameItem.id,
          id: generateRandomUuid(),
        });
        break;
    }

    return newGameItem;
  },
});
