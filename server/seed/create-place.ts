import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { placeTable } from '../db/schema';
import { placeEntities } from '../entities/places';

export const createPlace = async () => {
  for (const place of placeEntities) {
    const findPlace = await db.query.placeTable.findFirst({
      where: eq(placeTable.id, place.id),
    });
    if (place.id === findPlace?.id) {
      continue;
    }
    await db.insert(placeTable).values(place);
  }
  console.log('✔ places create');
  return;
};
createPlace();
