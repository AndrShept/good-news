import { eq } from 'drizzle-orm';

import { resourceTemplate } from '../data/resource-template';
import { db } from '../db/db';
import { itemTemplateTable } from '../db/schema';

export const createResource = async () => {
  for (const resource of resourceTemplate) {
    const findOne = await db.query.itemTemplateTable.findFirst({ where: eq(itemTemplateTable.id, resource.id) });
    if (findOne) continue;
    await db.insert(itemTemplateTable).values({
      ...resource,
    });
  }
  console.log('✔ resource create');
  return;
};
createResource();
