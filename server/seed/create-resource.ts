import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { gameItemTable, modifierTable, placeTable, resourceTable } from '../db/schema';
import { resourceEntities } from '../entities/resource';
import { resourceModifierEntity } from '../entities/resource-modifier';
import { generateRandomUuid } from '../lib/utils';

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

    const [{ resourceId }] = await db
      .insert(resourceTable)
      .values({
        ...resource.resource,
        gameItemId: resource.id!,
      })
      .returning({ resourceId: resourceTable.id });
    await db.insert(modifierTable).values({ ...resourceModifierEntity[resource.resource.type], resourceId });
  }
  console.log('✔ resource create');
  return;
};
createResource();
