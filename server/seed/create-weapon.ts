import { eq } from 'drizzle-orm';

import { weaponTemplate } from '../data/weapon-template';
import { db } from '../db/db';
import { itemTemplateTable } from '../db/schema';

export const createWeapon = async () => {
  for (const weapon of weaponTemplate) {
    const findOne = await db.query.itemTemplateTable.findFirst({ where: eq(itemTemplateTable.id, weapon.id) });
    if (findOne) continue;
    await db.insert(itemTemplateTable).values({
      ...weapon,
    });
  }
  console.log('✔ weapons create');
  return;
};
createWeapon();
