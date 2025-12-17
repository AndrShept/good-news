import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { armorTable, gameItemTable, shieldTable } from '../db/schema';
import { shieldEntities } from '../entities/shield';

export const createShield = async () => {
  for (const shield of shieldEntities) {
    const findShield = await db.query.gameItemTable.findFirst({ where: eq(gameItemTable.id, shield.id) });
    if (findShield) continue;
    await db.insert(gameItemTable).values(shield);
    await db.insert(shieldTable).values({
      ...shield.shield,
      gameItemId: shield.id,
    });
  }
  console.log('✔ shields create');
  return;
};
createShield();
