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
    id: '019a3500-856a-77a0-9cdb-6d7ba24d3f58',
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
     id: '019a3500-b2c6-732f-8a5d-58eff9bc0ad1',
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
    id: '019a3500-e3c9-72b1-86c7-3e8c0b8e3533',
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
    id: '019a3500-fe66-79a0-8514-263d5bd480ad',
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
    id: '019a3501-1881-70cb-a2d1-ad6d6f5230b9',
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
    id: '019a3501-3f2c-7741-96b6-e7aafd964849',
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
    id: '019a3501-5c1d-7831-b65d-4db4608504c1',
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
    id: '019a3501-741f-7f69-b789-3a4167bbb212',
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
    id: '019a3501-8e70-761f-8a98-837ecc7066d1',
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
    id: '019a3501-ad71-726f-85bd-ec6379738e2f',
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
    id : '019a3501-cafb-7ebd-b1e9-f4e1db2e8df4',
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
