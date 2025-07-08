import { db } from './db/db';
import { gameItemTable, modifierTable } from './db/schema';
import { generateRandomUuid } from './lib/utils';

const name = 'health potion';
const image = '/sprites/equipments/amulets/small-health.png';

const go = async () => {
  const [modifier] = await db
    .insert(modifierTable)
    .values({
      id: generateRandomUuid(),
      restoreHealth: 10
    })
    .returning();
  await db.insert(gameItemTable).values({
    id: generateRandomUuid(),
    name,
    image,
    type: 'POTION',
    price: 60,
    modifierId: modifier.id,
  });
  console.log('item cteated !!!');
};

go();
