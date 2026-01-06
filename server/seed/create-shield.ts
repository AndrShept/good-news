import { eq } from 'drizzle-orm';

import { db } from '../db/db';
import { shieldTemplate } from '../data/shield-template';
import { itemTemplateTable } from '../db/schema';


export const createShield = async () => {
   for (const shield of shieldTemplate) {
     const findOne = await db.query.itemTemplateTable.findFirst({ where: eq(itemTemplateTable.id, shield.id) });
     if (findOne) continue;
     await db.insert(itemTemplateTable).values({
       ...shield,
     });
   }
  console.log('✔ shields create');
  return;
};
createShield();
