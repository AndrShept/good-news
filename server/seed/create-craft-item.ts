import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { craftItemTable } from '../db/schema';
import { armorEntities } from '../entities/armor';
import { weaponEntities } from '../entities/weapon';

export const createCraftItem = async () => {
  // const weapons = Object.values(weaponEntities);
  // const armors = Object.values(armorEntities);

  for (const weapon of weaponEntities) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, weapon.id) });
    if (findCraftItem || !weapon.craftInfo) continue;
    await db.insert(craftItemTable).values({
      gameItemId: weapon.id,
      craftTime: weapon.craftInfo.craftTIme,
      requiredCraftResourceCategory: weapon.craftInfo.baseResourceCategory,
      requiredBuildingType: weapon.craftInfo.requiredBuildingType,
    });
  }
  for (const armor of armorEntities) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, armor.id) });
    if (findCraftItem || !armor.craftInfo) continue;
    await db.insert(craftItemTable).values({
      gameItemId: armor.id,
      craftTime: armor.craftInfo.craftTIme,
      requiredCraftResourceCategory: armor.craftInfo.baseResourceCategory,
      requiredBuildingType: armor.craftInfo.requiredBuildingType,
    });
  }
  console.log('create!');
};

createCraftItem();
