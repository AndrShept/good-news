import type { gameItemTable, potionTable } from '../db/schema';
import { generateRandomUuid } from '../lib/utils';

type PotionType = {
  strength: string;
  intelligence: string;
  constitution: string;
  dexterity: string;
  luck: string;
  smallHealth: string;
  smallMana: string;
  smallRestore: string;
  mediumHealth: string;
  mediumMana: string;
  mediumRestore: string;
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
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/str.png',
        name: 'Effect of Might',
        type: 'POSITIVE',
        modifier: { strength: 8 },
      },
    },
  },
  constitution: {
    image: '/sprites/potions/const.png',
    name: 'Constitution Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/const.png',
        name: 'Effect of Vitality',
        type: 'POSITIVE',
        modifier: { constitution: 8 },
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
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/int.png',
        name: 'Effect of Wisdom',
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
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/dex.png',
        name: 'Effect of Agility',
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
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: '/sprites/potions/luck.png',
        name: 'Effect of Fortune',
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
      restore: { mana: 70 },
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

  mediumHealth: {
    image: '/sprites/potions/medium-health.png',
    name: 'Medium Health Potion',
    price: 70,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'RESTORE',
      restore: { health: 100 },
    },
  },
  mediumMana: {
    image: '/sprites/potions/medium-mana.png',
    name: 'Medium Mana Potion',
    price: 55,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'RESTORE',
      restore: { mana: 150 },
    },
  },

  mediumRestore: {
    image: '/sprites/potions/medium-restore.png',
    name: 'Medium Restore Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'RESTORE',
      restore: { health: 70, mana: 90 },
    },
  },
};
