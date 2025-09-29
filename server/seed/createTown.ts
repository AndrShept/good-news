import { createBuildings, createBuildingsOnTOwn, createTowns } from './create';

const create = async () => {
  // await createTowns();
  // await createBuildings();
  await createBuildingsOnTOwn();
};

create();
