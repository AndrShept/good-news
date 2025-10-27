import { db } from '../db/db';
import { gameItemTable, weaponTable } from '../db/schema';
import { weaponEntities } from '../entities/weapon';

export const createWeapons = async () => {
  const weapons = Object.values(weaponEntities);
  for (const weapon of weapons) {
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
