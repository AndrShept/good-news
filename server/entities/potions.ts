import { imageConfig } from '../../frontend/src/lib/config';
import type { gameItemTable, potionTable } from '../db/schema';

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
    image: imageConfig.icon.POTION.buff.strength,
    name: 'Strength Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: imageConfig.icon.POTION.buff.strength,
        name: 'Effect of Might',
        type: 'POSITIVE',
        modifier: { strength: 8 },
      },
    },
  },
  constitution: {
     id: '019a3500-b2c6-732f-8a5d-58eff9bc0ad1',
    image: imageConfig.icon.POTION.buff.constitution,
    name: 'Constitution Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: imageConfig.icon.POTION.buff.constitution,
        name: 'Effect of Vitality',
        type: 'POSITIVE',
        modifier: { constitution: 8 },
      },
    },
  },

  intelligence: {
    id: '019a3500-e3c9-72b1-86c7-3e8c0b8e3533',
    image: imageConfig.icon.POTION.buff.intelligence,
    name: 'Intelligence Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: imageConfig.icon.POTION.buff.intelligence,
        name: 'Effect of Wisdom',
        type: 'POSITIVE',
        modifier: { intelligence: 8 },
      },
    },
  },

  dexterity: {
    id: '019a3500-fe66-79a0-8514-263d5bd480ad',
    image: imageConfig.icon.POTION.buff.dexterity,
    name: 'Dexterity Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: imageConfig.icon.POTION.buff.dexterity,
        name: 'Effect of Agility',
        type: 'POSITIVE',
        modifier: { dexterity: 8 },
      },
    },
  },

  luck: {
    id: '019a3501-1881-70cb-a2d1-ad6d6f5230b9',
    image: imageConfig.icon.POTION.buff.luck,
    name: 'Luck Potion',
    price: 100,
    type: 'POTION',
    potion: {
      gameItemId: '',
      type: 'BUFF',
      buffInfo: {
        gameItemId: '',
        duration: 60 * 60 * 1000,
        image: imageConfig.icon.POTION.buff.luck,
        name: 'Effect of Fortune',
        type: 'POSITIVE',
        modifier: { luck: 8 },
      },
    },
  },

  smallHealth: {
    id: '019a3501-3f2c-7741-96b6-e7aafd964849',
    image: imageConfig.icon.POTION.restore.smallHealth,
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
    image: imageConfig.icon.POTION.restore.smallMana,
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
    image: imageConfig.icon.POTION.restore.smallRestore,
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
    image:  imageConfig.icon.POTION.restore.mediumHealth,
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
    image: imageConfig.icon.POTION.restore.mediumMana,
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
    image: imageConfig.icon.POTION.restore.mediumRestore,
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
