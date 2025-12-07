import type { ArmorType, CraftItemRequiredResources, GameItemType, ResourceType } from '@/shared/types';

import { armorEntities } from './armor';
import { resourceEntities } from './resource';
import { weaponEntities } from './weapon';

function isIngot(
  r: (typeof resourceEntities)[number],
): r is Extract<(typeof resourceEntities)[number], { resource: { category: 'INGOT' } }> {
  return r.resource.category === 'INGOT';
}

const weaponNames = weaponEntities.map((weapon) => weapon.name);
export type WeaponNameType = (typeof weaponNames)[number];
const armorNames = armorEntities.map((armor) => armor.name);
export type ArmorNameType = (typeof armorNames)[number];
const ingots = resourceEntities.filter(isIngot);
const names = ingots.map((i) => i.name);
export type IngotName = (typeof names)[number];

const tet = {}

export interface ICraftConfig {
  WEAPON: Record<string, Partial<Record<ResourceType, CraftItemRequiredResources[]>>>;
  ARMOR: Record<string, Partial<Record<ResourceType, CraftItemRequiredResources[]>>>;
  RESOURCES: Record<string, CraftItemRequiredResources[]>;
  POTION: Record<string, CraftItemRequiredResources[]>;
  MISC: Record<string, CraftItemRequiredResources[]>;
}



export const craftConfig: ICraftConfig = {
  WEAPON: {
    broadsword: {
      'IRON-INGOT': [{ type: 'IRON-INGOT', quantity: 10 }],
      'COPPER-INGOT': [{ type: 'COPPER-INGOT', quantity: 10 }],
      'SILVER-INGOT': [{ type: 'SILVER-INGOT', quantity: 10 }],
      'GOLD-INGOT': [{ type: 'GOLD-INGOT', quantity: 10 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL-INGOT', quantity: 10 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
    },
    kryss: {
      'IRON-INGOT': [{ type: 'IRON-INGOT', quantity: 10 }],
      'COPPER-INGOT': [{ type: 'COPPER-INGOT', quantity: 10 }],
      'SILVER-INGOT': [{ type: 'SILVER-INGOT', quantity: 10 }],
      'GOLD-INGOT': [{ type: 'GOLD-INGOT', quantity: 10 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL-INGOT', quantity: 10 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
    },
  },
  ARMOR: {
    'simple gloves': {
      'IRON-INGOT': [{ type: 'IRON-INGOT', quantity: 5 }],
      'COPPER-INGOT': [
        { type: 'COPPER-INGOT', quantity: 5 },
        { type: 'REGULAR-LEATHER', quantity: 3 },
      ],
      'SILVER-INGOT': [{ type: 'SILVER-INGOT', quantity: 5 }],
      'GOLD-INGOT': [{ type: 'GOLD-INGOT', quantity: 5 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL-INGOT', quantity: 5 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE-INGOT', quantity: 5 }],
    },
    'plate armor': {
      'IRON-INGOT': [{ type: 'IRON-INGOT', quantity: 10 }],
      'COPPER-INGOT': [{ type: 'COPPER-INGOT', quantity: 10 }],
      'SILVER-INGOT': [{ type: 'SILVER-INGOT', quantity: 10 }],
      'GOLD-INGOT': [{ type: 'GOLD-INGOT', quantity: 10 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL-INGOT', quantity: 10 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
    },
  },
  RESOURCES: {
    'iron ingot': [{ type: 'IRON-ORE', quantity: 3 }],
    'copper ingot': [{ type: 'COPPER-ORE', quantity: 3 }],
    'silver ingot': [{ type: 'SILVER-ORE', quantity: 3 }],
    'gold ingot': [{ type: 'GOLD-ORE', quantity: 3 }],
    'mithril ingot': [{ type: 'MITHRIL-ORE', quantity: 3 }],
    'adamantine ingot': [{ type: 'ADAMANTINE-ORE', quantity: 3 }],
  },
  POTION: {},
  MISC: {},
};
