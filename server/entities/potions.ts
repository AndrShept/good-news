import type { gameItemTable, potionTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';

type PotionType = {
  strength: string;
  intelligence: string;
  dexterity: string;
  luck: string;
  smallHealth: string;
  smallMana: string;
  smallRestore: string;
};

type CreateGameItemPotion = typeof gameItemTable.$inferInsert & {
  potion: typeof potionTable.$inferInsert;
};


export const potionEntities: Record<keyof PotionType, CreateGameItemPotion> = {
  strength: {
    image: '/sprites/potions/str.png',
    name: 'Strength Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      potionEffect: {
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/str.png',
        name: 'Strength Potion',
        type: 'POSITIVE',
        modifier: { strength: 8 },
      },
    },
  },

  intelligence: {
    image: '/sprites/potions/int.png',
    name: 'Intelligence Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      potionEffect: {
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/int.png',
        name: 'Intelligence Potion',
        type: 'POSITIVE',
        modifier: { intelligence: 8 },
      },
    },
  },

  dexterity: {
    image: '/sprites/potions/dex.png',
    name: 'Dexterity Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      potionEffect: {
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/dex.png',
        name: 'Dexterity Potion',
        type: 'POSITIVE',
        modifier: { dexterity: 8 },
      },
    },
  },

  luck: {
    image: '/sprites/potions/luck.png',
    name: 'Luck Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      potionEffect: {
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/luck.png',
        name: 'Luck Potion',
        type: 'POSITIVE',
        modifier: { luck: 8 },
      },
    },
  },

  smallHealth: {
    image: '/sprites/potions/small-health.png',
    name: 'Small Health Potion',
    price: 40,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'RESTORE',
      restore: { health: 50 },
    },
  },

  smallMana: {
    image: '/sprites/potions/small-mana.png',
    name: 'Small Mana Potion',
    price: 30,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'RESTORE',
      restore: { mana: 50 },
    },
  },

  smallRestore: {
    image: '/sprites/potions/small-restore.png',
    name: 'Small Restore Potion',
    price: 55,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'RESTORE',
      restore: { health: 35, mana: 40 },
    },
  },
};
