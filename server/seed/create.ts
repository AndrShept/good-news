import { db } from '../db/db';
import { buildingTable, gameItemTable, modifierTable, townTable, townsToBuildingsTable } from '../db/schema';
import { buildingEntities } from '../entities/buildings';
import { potionEntities } from '../entities/potions';
import { townEntities } from '../entities/towns';
import { buildingMapData } from '../lib/buildingMapData';

const createTowns = async () => {
  const towns = Object.values(townEntities).map((item) => ({ ...item, buildings: null }));
  await db.insert(townTable).values(towns);
};

const createBuildings = async () => {
  const buildings = Object.values(buildingEntities);

  await db.insert(buildingTable).values(buildings);
};

const createBuildingsOnTOwn = async () => {
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
const createPotions = async () => {
  const modifiers = Object.values(potionEntities).map((item) => item.modifier!);
  const potions = Object.values(potionEntities).map((item) => ({ ...item, modifier: null }));
  await db.insert(modifierTable).values(modifiers);
  await db.insert(gameItemTable).values(potions);
};

const go = async () => {
  console.time('create');

  await createBuildings();
  await createTowns();
  await createPotions();
  await createBuildingsOnTOwn();
  await buildingMapData(townEntities.SOLMERE.name);
  console.timeEnd('create');
  console.log('COMPLETE!');
  return;
};
go();
