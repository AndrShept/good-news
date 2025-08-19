import type { GameItem } from '@/shared/types';

type PotionType = {
  strength: string;
  intelligence: string;
  dexterity: string;
  luck: string;
  smallHealth: string;
  smallMana: string;
  smallRestore: string;
};

export const potionEntities: Record<keyof PotionType, GameItem> = {
  strength: {
    id: '0198c1bd-3ce6-7daf-8034-9a5ea711ce5e',
    image: '/sprites/potions/str.png',
    name: 'strength potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1bd-7e62-7094-91dd-a37563447e00',
    modifier: {
      id: '0198c1bd-7e62-7094-91dd-a37563447e00',
      strength: 8,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      luck: 0,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 0,
      restoreMana: 0,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
  intelligence: {
    id: '0198c1bd-ae4e-7034-b54b-61f32e53e05b',
    image: '/sprites/potions/int.png',
    name: 'intelligence potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1bd-c92c-7942-b0f6-cf4ceb61bf59',
    modifier: {
      id: '0198c1bd-c92c-7942-b0f6-cf4ceb61bf59',
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 8,
      luck: 0,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 0,
      restoreMana: 0,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
  dexterity: {
    id: '0198c1bd-febc-723e-8b63-91bb6f3c434f',
    image: '/sprites/potions/dex.png',
    name: 'dexterity potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1bd-febc-723e-8b63-91bb6f3c434f',
    modifier: {
      id: '0198c1bd-febc-723e-8b63-91bb6f3c434f',
      strength: 0,
      dexterity: 8,
      constitution: 0,
      intelligence: 0,
      luck: 0,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 0,
      restoreMana: 0,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
  luck: {
    id: '0198c1be-442c-73ee-aecf-653bd60fc30e',
    image: '/sprites/potions/luck.png',
    name: 'luck potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1be-5dc0-7883-b342-eed9246ef4ad',
    modifier: {
      id: '0198c1be-5dc0-7883-b342-eed9246ef4ad',
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      luck: 8,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 0,
      restoreMana: 0,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
  smallHealth: {
    id: '0198c1c0-5ac1-7395-bffe-8f4b5c1e382c',
    image: '/sprites/potions/small-health.png',
    name: 'small health potion',
    price: 40,
    type: 'POTION',
    duration: 0,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1c0-718f-7398-b507-696232aff697',
    modifier: {
      id: '0198c1c0-718f-7398-b507-696232aff697',
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      luck: 0,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 40,
      restoreMana: 0,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
  smallMana: {
    id: '0198c1c1-9418-722d-9d49-1898e0534f05',
    image: '/sprites/potions/small-mana.png',
    name: 'small mana potion',
    price: 30,
    type: 'POTION',
    duration: 0,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1c1-ac96-77a9-a999-6250c384731f',
    modifier: {
      id: '0198c1c1-ac96-77a9-a999-6250c384731f',
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      luck: 0,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 0,
      restoreMana: 50,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
  smallRestore: {
    id: '0198c1c3-5069-76a1-a80b-24750d4f9300',
    image: '/sprites/potions/small-restore.png',
    name: 'small restore potion',
    price: 55,
    type: 'POTION',
    duration: 0,
    updatedAt: null,
    weaponHand: null,
    weaponType: null,
    createdAt: new Date().toISOString(),
    modifierId: '0198c1c3-9fba-74d0-b2f4-d072d6030e06',
    modifier: {
      id: '0198c1c3-9fba-74d0-b2f4-d072d6030e06',
      strength: 0,
      dexterity: 0,
      constitution: 0,
      intelligence: 0,
      luck: 0,

      minDamage: 0,
      maxDamage: 0,
      evasion: 0,
      armor: 0,
      magicResistances: 0,

      maxHealth: 0,
      maxMana: 0,

      meleeDamage: 0,
      meleeDamageCritChance: 0,
      meleeDamageCritPower: 0,

      spellDamage: 0,
      spellDamageCritChance: 0,
      spellDamageCritPower: 0,

      restoreHealth: 35,
      restoreMana: 45,
      healthRegeneration: 0,
      manaRegeneration: 0,

      createdAt: new Date().toISOString(),
      updatedAt: null,
    },
  },
};
