import { townEntities } from '../entities/towns';
import { buildingMapData } from '../lib/buildingMapData';

const go = async () => {
  await buildingMapData('01998100-a29d-7b0f-abad-edd4ef317472');
  console.info('COMPLETE!');
  return;
};
go();
