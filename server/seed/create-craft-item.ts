import { db } from '../db/db';
import { craftTable } from '../db/schema';
import { weaponEntities } from '../entities/weapon';

export const createCraftItem = async () => {
  const weapons = Object.values(weaponEntities);

  for (const weapon of weapons) {
    await db.insert(craftTable).values({
      gameItemId: weapon.id,
      craftTime: 10_000,
      craftResources: [{ type: 'IRON', quantity: 20 }],
    });
  }
  console.log('create!');
};

createCraftItem();
