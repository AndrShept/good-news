import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { armorTable, gameItemTable } from '../db/schema';
import { armorEntities } from '../entities/armor';

export const createArmors = async () => {
  const armors = Object.values(armorEntities);
  for (const armor of armors) {
    const findArmor = await db.query.gameItemTable.findFirst({ where: eq(gameItemTable.id, armor.id) });
    if (findArmor) continue;
    await db.insert(gameItemTable).values(armor);
    await db.insert(armorTable).values({
      ...armor.armor,
      gameItemId: armor.id,
    });
  }
  console.log('✔ armors create');
  return;
};
createArmors();
