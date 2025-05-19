import type { GameItem } from '@/shared/types';

export const potion: Record<string, GameItem> = {
  strength: {
    id: Bun.randomUUIDv7(),
    image: '/sprites/potions/str.png',
    name: 'strength potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    createdAt: new Date().toISOString(),
    modifierId: Bun.randomUUIDv7(),
    modifier: {
      id: Bun.randomUUIDv7(),
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
    id: Bun.randomUUIDv7(),
    image: '/sprites/potions/int.png',
    name: 'intelligence potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    createdAt: new Date().toISOString(),
    modifierId: Bun.randomUUIDv7(),
    modifier: {
      id: Bun.randomUUIDv7(),
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
    id: Bun.randomUUIDv7(),
    image: '/sprites/potions/dex.png',
    name: 'dexterity potion',
    price: 100,
    type: 'POTION',
    duration: 1000 * 60 * 60,
    updatedAt: null,
    createdAt: new Date().toISOString(),
    modifierId: Bun.randomUUIDv7(),
    modifier: {
      id: Bun.randomUUIDv7(),
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
};
