import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { craftItemTable } from '../db/schema';
import { armorEntities } from '../entities/armor';
import { resourceEntities } from '../entities/resource';
import { weaponEntities } from '../entities/weapon';

export const createCraftItem = async () => {
  // const weapons = Object.values(weaponEntities);
  // const armors = Object.values(armorEntities);

  for (const weapon of weaponEntities) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, weapon.id) });
    if (findCraftItem || !weapon.craftInfo) continue;
    await db.insert(craftItemTable).values({
      gameItemId: weapon.id,
      requiredCraftResourceCategory: weapon.craftInfo.baseResourceCategory,
      requiredBuildingType: weapon.craftInfo.requiredBuildingType,
    });
  }
  for (const armor of armorEntities) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, armor.id) });
    if (findCraftItem || !armor.craftInfo) continue;
    await db.insert(craftItemTable).values({
      gameItemId: armor.id,
      requiredCraftResourceCategory: armor.craftInfo.baseResourceCategory,
      requiredBuildingType: armor.craftInfo.requiredBuildingType,
    });
  }
  for (const resource of resourceEntities) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, resource.id) });
    if (findCraftItem || !resource.craftInfo) continue;
    await db.insert(craftItemTable).values({
      gameItemId: resource.id,
      requiredCraftResourceCategory: resource.craftInfo.baseResourceCategory,
      requiredBuildingType: resource.craftInfo.requiredBuildingType,
    });
  }
  console.log('create!');
};

createCraftItem();
