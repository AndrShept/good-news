import { eq } from 'drizzle-orm';

import { armorTemplate } from '../data/armor-template';
import { db } from '../db/db';
import { itemTemplateTable } from '../db/schema';

export const createArmor = async () => {
  for (const armor of armorTemplate) {
    const findOne = await db.query.itemTemplateTable.findFirst({ where: eq(itemTemplateTable.id, armor.id) });
    if (findOne) continue;
    await db.insert(itemTemplateTable).values({
      ...armor,
    });
  }
  console.log('✔ armors create');
  return;
};
createArmor();
