import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { mapTable, placeTable } from '../db/schema';
import { mapEntities } from '../entities/map';
import { getMapJson } from '../lib/utils';

export const createMap = async () => {
  const maps = Object.values(mapEntities);
  for (const map of maps) {
    const dataMap = getMapJson(map.id);
    const findMap = await db.query.mapTable.findFirst({
      where: eq(mapTable.id, map.id),
    });
    if (map.id === findMap?.id) {
      continue;
    }

    const { width, height, tileheight, tilewidth } = dataMap.jsonUrl;
    await db.insert(mapTable).values({ ...map, height, width, tileHeight: tileheight, tileWidth: tilewidth });
  }
  console.log('✔ map create');
  return;
};
createMap();
