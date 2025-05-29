import { db } from './db/db';
import { gameItemTable, modifierTable } from './db/schema';
import { generateRandomUuid } from './lib/utils';

const name = 'TOP AMULET';
const image = '/sprites/equipments/amulets/icon34.png';

const go = async () => {
  const [modifier] = await db
    .insert(modifierTable)
    .values({
      id: generateRandomUuid(),
        strength : 10,
        intelligence : 10
    })
    .returning();
  await db.insert(gameItemTable).values({
    id: generateRandomUuid(),
    name,
    image,
    type: 'AMULET',
    price: 204,
    modifierId: modifier.id,
  });
  console.log('item cteated !!!');
};

go();
