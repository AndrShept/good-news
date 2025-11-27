import type { ArmorType, CraftItemRequiredResources, ResourceType } from '@/shared/types';

import { armorEntities } from './armor';
import { resourceEntities } from './resource';
import { weaponEntities } from './weapon';

function isIngot(
  r: (typeof resourceEntities)[number],
): r is Extract<(typeof resourceEntities)[number], { resource: { category: 'INGOT' } }> {
  return r.resource.category === 'INGOT';
}

const weaponNames = weaponEntities.map((weapon) => weapon.name);
type WeaponNameType = (typeof weaponNames)[number];
const armorNames = armorEntities.map((armor) => armor.name);
type ArmorNameType = (typeof armorNames)[number];
const ingots = resourceEntities.filter(isIngot);
const names = ingots.map((i) => i.name);
type IngotName = (typeof names)[number];

export interface ICraftConfig {
  WEAPON: Record<WeaponNameType, Partial<Record<ResourceType, CraftItemRequiredResources[]>>>;
  ARMOR: Record<ArmorNameType, Partial<Record<ResourceType, CraftItemRequiredResources[]>>>;
  RESOURCE: Record<IngotName, CraftItemRequiredResources[]>;
}

export const craftConfig = {
  WEAPON: {
    broadsword: {
      IRON: [{ type: 'IRON', quantity: 10 }],
      COPPER: [{ type: 'COPPER', quantity: 10 }],
      SILVER: [{ type: 'SILVER', quantity: 10 }],
      GOLD: [{ type: 'GOLD', quantity: 10 }],
      MITHRIL: [{ type: 'MITHRIL', quantity: 10 }],
      ADAMANTINE: [{ type: 'ADAMANTINE', quantity: 10 }],
    },
    kryss: {
      IRON: [{ type: 'IRON', quantity: 10 }],
      COPPER: [{ type: 'COPPER', quantity: 10 }],
      SILVER: [{ type: 'SILVER', quantity: 10 }],
      GOLD: [{ type: 'GOLD', quantity: 10 }],
      MITHRIL: [{ type: 'MITHRIL', quantity: 10 }],
      ADAMANTINE: [{ type: 'ADAMANTINE', quantity: 10 }],
    },
  },
  ARMOR: {
    'simple gloves': {
      IRON: [{ type: 'IRON', quantity: 5 }],
      COPPER: [
        { type: 'COPPER', quantity: 5 },
        { type: 'REGULAR-LEATHER', quantity: 3 },
      ],
      SILVER: [{ type: 'SILVER', quantity: 5 }],
      GOLD: [{ type: 'GOLD', quantity: 5 }],
      MITHRIL: [{ type: 'MITHRIL', quantity: 5 }],
      ADAMANTINE: [{ type: 'ADAMANTINE', quantity: 5 }],
    },
    'plate armor': {
      IRON: [{ type: 'IRON', quantity: 10 }],
      COPPER: [{ type: 'COPPER', quantity: 10 }],
      SILVER: [{ type: 'SILVER', quantity: 10 }],
      GOLD: [{ type: 'GOLD', quantity: 10 }],
      MITHRIL: [{ type: 'MITHRIL', quantity: 10 }],
      ADAMANTINE: [{ type: 'ADAMANTINE', quantity: 10 }],
    },
  },
  RESOURCE: {
    'iron ingot': [{ type: 'IRON', quantity: 3 }],
    'copper ingot': [{ type: 'COPPER', quantity: 3 }],
    'silver ingot': [{ type: 'SILVER', quantity: 3 }],
    'gold ingot': [{ type: 'GOLD', quantity: 3 }],
    'mithril ingot': [{ type: 'MITHRIL', quantity: 3 }],
    'adamantine ingot': [{ type: 'ADAMANTINE', quantity: 3 }],
  },
} as const satisfies ICraftConfig;
