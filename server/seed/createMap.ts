import { townEntities } from '../entities/towns';
import { buildingMapData } from '../lib/buildingMapData';

const go = async () => {
  console.time('create');

  await buildingMapData(townEntities.SOLMERE.name);
  console.timeEnd('create');
  console.info('COMPLETE!');
  return;
};
go();
