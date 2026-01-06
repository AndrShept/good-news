import { eq } from 'drizzle-orm';
import { potionTemplate } from '../data/potion-template';
import { db } from '../db/db';
import { itemTemplateTable } from '../db/schema';

export const createPotion = async () => {
  for (const potion of potionTemplate) {
    const findOne = await db.query.itemTemplateTable.findFirst({ where: eq(itemTemplateTable.id, potion.id) });
    if (findOne) continue;
    await db.insert(itemTemplateTable).values({
      ...potion,
    });
  }
  console.log('✔ potions create');
  return;
};
createPotion();
