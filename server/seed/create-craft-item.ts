import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { craftItemTable } from '../db/schema';
import { type ArmorNameType, armorEntities } from '../entities/armor';
import { craftConfig } from '../entities/craft-config';
import { type WeaponNameType, weaponEntities } from '../entities/weapon';

export const createCraftItem = async () => {
  const weapons = Object.values(weaponEntities);
  const armors = Object.values(armorEntities);

  for (const weapon of weapons) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, weapon.id) });
    if (findCraftItem) continue;
    await db.insert(craftItemTable).values({
      gameItemId: weapon.id,
      craftTime: 10_000,
      requiredResources: craftConfig.WEAPON[weapon.name as WeaponNameType].IRON,
    });
  }
  for (const armor of armors) {
    const findCraftItem = await db.query.craftItemTable.findFirst({ where: eq(craftItemTable.gameItemId, armor.id) });
    if (findCraftItem) continue;
    await db.insert(craftItemTable).values({
      gameItemId: armor.id,
      craftTime: 10_000,
      requiredResources: craftConfig.ARMOR[armor.name as ArmorNameType].IRON,
    });
  }
  console.log('create!');
};

createCraftItem();
