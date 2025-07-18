import { eq } from 'drizzle-orm';
import { db } from '../db/db';
import { heroTable } from '../db/schema';

export const heroOffline = async (heroId: string) => {
  await db
    .update(heroTable)
    .set({
      isOnline: false,
    })
    .where(eq(heroTable.id, heroId));
};
