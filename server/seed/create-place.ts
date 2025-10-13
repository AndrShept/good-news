import { db } from '../db/db';
import { placeTable } from '../db/schema';
import { placeEntities } from '../entities/places';

export const createPlace = async () => {
  await db.insert(placeTable).values(placeEntities);
};

createPlace();
