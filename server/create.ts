import { db } from './db/db';
import { gameItemTable, modifierTable } from './db/schema';
import { generateRandomUuid } from './lib/utils';

const name = 'small restore potion';
const image = '/sprites/potions/small-mana.png';

const go = async () => {
  const [modifier] = await db
    .insert(modifierTable)
    .values({
      id: generateRandomUuid(),
      restoreMana: 40,
      restoreHealth: 60
    })
    .returning();
  await db.insert(gameItemTable).values({
    id: generateRandomUuid(),
    name,
    image,
    type: 'POTION',
    modifierId: modifier.id,
  });
  console.log('item cteated !!!');
};

go();
