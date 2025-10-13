import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { gameItemTable, placeTable, resourceTable } from '../db/schema';
import { resourceEntities } from '../entities/resource';

export const createResource = async () => {
  for (const resource of resourceEntities) {
    const findResource = await db.query.gameItemTable.findFirst({
      where: eq(resourceTable.id, resource.id!),
    });
    if (resource.id === findResource?.id) {
      continue;
    }
    await db.insert(gameItemTable).values({
      ...resource,
    });

    await db.insert(resourceTable).values({
      ...resource.resource,
      gameItemId: resource.id!,
    });
  }
  console.log('✔ places create');
  return;
};
createResource();
