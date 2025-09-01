import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { heroTable } from '../db/schema';

export const heroOnline = async (heroId: string) => {
  await db
    .update(heroTable)
    .set({
      isOnline: true,
    })
    .where(eq(heroTable.id, heroId));
};
