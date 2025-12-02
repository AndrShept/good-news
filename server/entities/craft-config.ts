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

export interface ICraftConfig {
  WEAPON: Record<string, Partial<Record<ResourceType, CraftItemRequiredResources[]>>>;
  ARMOR: Record<string, Partial<Record<ResourceType, CraftItemRequiredResources[]>>>;
  RESOURCES: Record<string, CraftItemRequiredResources[]>;
  POTION: Record<string, CraftItemRequiredResources[]>;
  MISC: Record<string, CraftItemRequiredResources[]>;
}

export const craftConfig = {
  WEAPON: {
    broadsword: {
      'IRON-INGOT': [{ type: 'IRON', quantity: 10 }],
      'COPPER-INGOT': [{ type: 'COPPER', quantity: 10 }],
      'SILVER-INGOT': [{ type: 'SILVER', quantity: 10 }],
      'GOLD-INGOT': [{ type: 'GOLD', quantity: 10 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL', quantity: 10 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE', quantity: 10 }],
    },
    kryss: {
      'IRON-INGOT': [{ type: 'IRON', quantity: 10 }],
      'COPPER-INGOT': [{ type: 'COPPER', quantity: 10 }],
      'SILVER-INGOT': [{ type: 'SILVER', quantity: 10 }],
      'GOLD-INGOT': [{ type: 'GOLD', quantity: 10 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL', quantity: 10 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE', quantity: 10 }],
    },
  },
  ARMOR: {
    'simple gloves': {
      'IRON-INGOT': [{ type: 'IRON', quantity: 5 }],
      'COPPER-INGOT': [
        { type: 'COPPER', quantity: 5 },
        { type: 'REGULAR-LEATHER', quantity: 3 },
      ],
      'SILVER-INGOT': [{ type: 'SILVER', quantity: 5 }],
      'GOLD-INGOT': [{ type: 'GOLD', quantity: 5 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL', quantity: 5 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE', quantity: 5 }],
    },
    'plate armor': {
      'IRON-INGOT': [{ type: 'IRON', quantity: 10 }],
      'COPPER-INGOT': [{ type: 'COPPER', quantity: 10 }],
      'SILVER-INGOT': [{ type: 'SILVER', quantity: 10 }],
      'GOLD-INGOT': [{ type: 'GOLD', quantity: 10 }],
      'MITHRIL-INGOT': [{ type: 'MITHRIL', quantity: 10 }],
      'ADAMANTINE-INGOT': [{ type: 'ADAMANTINE', quantity: 10 }],
    },
  },
  RESOURCES: {
    'iron ingot': [{ type: 'IRON', quantity: 3 }],
    'copper ingot': [{ type: 'COPPER', quantity: 3 }],
    'silver ingot': [{ type: 'SILVER', quantity: 3 }],
    'gold ingot': [{ type: 'GOLD', quantity: 3 }],
    'mithril ingot': [{ type: 'MITHRIL', quantity: 3 }],
    'adamantine ingot': [{ type: 'ADAMANTINE', quantity: 3 }],
    
  },
  POTION: {},
  MISC: {},
} as const satisfies ICraftConfig;
