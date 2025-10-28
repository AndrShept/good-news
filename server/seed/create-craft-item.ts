import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { craftItemTable } from '../db/schema';
import { armorEntities } from '../entities/armor';
import { weaponEntities } from '../entities/weapon';

export const createCraftItem = async () => {
  const weapons = Object.values(weaponEntities);
  const armors = Object.values(armorEntities);

  for (const weapon of weapons) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, weapon.id) });
    if (findCraftItem) continue;
    await db.insert(craftItemTable).values({
      gameItemId: weapon.id,
      craftTime: 10_000,
      craftResources: [{ type: 'IRON', quantity: 20 }],
    });
  }
  for (const armor of armors) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, armor.id) });
    if (findCraftItem) continue;
    await db.insert(craftItemTable).values({
      gameItemId: armor.id,
      craftTime: 10_000,
      craftResources: [{ type: 'IRON', quantity: 30 }],
    });
  }
  console.log('create!');
};

createCraftItem();
