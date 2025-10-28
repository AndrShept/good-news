import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { gameItemTable, weaponTable } from '../db/schema';
import { weaponEntities } from '../entities/weapon';

export const createWeapons = async () => {
  const weapons = Object.values(weaponEntities);
  for (const weapon of weapons) {
    const findWeapon = await db.query.gameItemTable.findFirst({ where: eq(gameItemTable.id, weapon.id) });
    if (findWeapon) continue;
    await db.insert(gameItemTable).values(weapon);
    await db.insert(weaponTable).values({
      ...weapon.weapon,
      gameItemId: weapon.id,
    });
  }
  console.log('✔ weapons create');
  return;
};
createWeapons();
