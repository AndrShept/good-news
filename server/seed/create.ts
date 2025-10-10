import { db } from '../db/db';
import { buildingTable, gameItemTable, modifierTable, potionTable, townTable, townsToBuildingsTable, weaponTable } from '../db/schema';
import { buildingEntities } from '../entities/buildings';
import { potionEntities } from '../entities/potions';
import { townEntities } from '../entities/towns';
import { weaponEntities } from '../entities/weapon';
import { buildingMapData } from '../lib/buildingMapData';

export const createTowns = async () => {
  const towns = Object.values(townEntities).map((item) => ({ ...item, buildings: null }));
  await db.insert(townTable).values(towns);
};

export const createBuildings = async () => {
  const buildings = Object.values(buildingEntities);

  await db.insert(buildingTable).values(buildings);
};

export const createBuildingsOnTOwn = async () => {
  const buildingOnTown = Object.values(townEntities)
    .flatMap((item) => {
      if (!!item.buildings?.length) {
        const obj = item.buildings.map((b) => ({ townId: item.id, buildingsId: b.buildingsId }));
        return obj;
      }
    })
    .filter((item) => !!item);

  await db.insert(townsToBuildingsTable).values(buildingOnTown);
};
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

  // await createBuildings();
  // await createTowns();
  // await createPotions();
  await createWeapons();
  // await createBuildingsOnTOwn();
  // await buildingMapData(townEntities.SOLMERE.name);
  console.timeEnd('create');
  console.info('COMPLETE!');
  return;
};
go();
