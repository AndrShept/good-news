import { db } from '../db/db';
import { gameItemTable, modifierTable, placeTable, potionTable, weaponTable } from '../db/schema';
import { buildingEntities } from '../entities/buildings';
import { potionEntities } from '../entities/potions';
import { weaponEntities } from '../entities/weapon';
import { buildingMapData } from '../lib/buildingMapData';



export const createPotions = async () => {
  const potions = Object.values(potionEntities);
  for (const potion of potions) {
    const [newPotion] = await db.insert(gameItemTable).values(potion).returning({ id: gameItemTable.id });
    await db.insert(potionTable).values({
      type: potion.potion.type,
      gameItemId: newPotion.id,
      potionEffect: potion.potion.potionEffect,
      restore: potion.potion.restore,
    });
  }
};
export const createWeapons = async () => {
  const weapons = Object.values(weaponEntities);
  for (const weapon of weapons) {
    const [newWeapon] = await db.insert(gameItemTable).values(weapon).returning({ id: gameItemTable.id });
    await db.insert(weaponTable).values({
      ...weapon.weapon,
      gameItemId: newWeapon.id,
    });
  }
};

const go = async () => {
  console.time('create');

  await createWeapons();
  console.timeEnd('create');
  console.info('COMPLETE!');
  return;
};
go();
