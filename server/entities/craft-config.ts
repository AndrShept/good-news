import type {
  ArmorType,
  CraftItemRequiredResources,
  CraftItemRequiredSkills,
  CraftItemRequirement,
  GameItemType,
  ResourceType,
} from '@/shared/types';

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
  WEAPON: Record<string, Partial<Record<ResourceType, CraftItemRequirement>>>;
  ARMOR: Record<string, Partial<Record<ResourceType, CraftItemRequirement>>>;
  RESOURCES: Record<string, CraftItemRequirement>;
  POTION: Record<string, CraftItemRequirement>;
  MISC: Record<string, CraftItemRequirement>;
}

export const craftConfig: ICraftConfig = {
  WEAPON: {
    broadsword: {
      'IRON-INGOT': {
        resources: [{ type: 'IRON-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 10 }],
      },
      'COPPER-INGOT': {
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [],
      },
      'SILVER-INGOT': {
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [],
      },
      'GOLD-INGOT': {
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [],
      },
      'MITHRIL-INGOT': {
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [],
      },
      'ADAMANTINE-INGOT': {
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [],
      },
    },

    kryss: {
      'IRON-INGOT': {
        resources: [{ type: 'IRON-INGOT', quantity: 10 }],
        skills: [],
      },
      'COPPER-INGOT': {
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [],
      },
      'SILVER-INGOT': {
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [],
      },
      'GOLD-INGOT': {
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [],
      },
      'MITHRIL-INGOT': {
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [],
      },
      'ADAMANTINE-INGOT': {
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [],
      },
    },
  },

  ARMOR: {
    'simple gloves': {
      'IRON-INGOT': {
        resources: [{ type: 'IRON-INGOT', quantity: 5 }],
        skills: [],
      },
      'COPPER-INGOT': {
        resources: [
          { type: 'COPPER-INGOT', quantity: 5 },
        ],
        skills: [],
      },
      'SILVER-INGOT': {
        resources: [{ type: 'SILVER-INGOT', quantity: 5 }],
        skills: [],
      },
      'GOLD-INGOT': {
        resources: [{ type: 'GOLD-INGOT', quantity: 5 }],
        skills: [],
      },
      'MITHRIL-INGOT': {
        resources: [{ type: 'MITHRIL-INGOT', quantity: 5 }],
        skills: [],
      },
      'ADAMANTINE-INGOT': {
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 5 }],
        skills: [],
      },
    },

    'plate armor': {
      'IRON-INGOT': {
        resources: [{ type: 'IRON-INGOT', quantity: 10 }],
        skills: [],
      },
      'COPPER-INGOT': {
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [],
      },
      'SILVER-INGOT': {
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [],
      },
      'GOLD-INGOT': {
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [],
      },
      'MITHRIL-INGOT': {
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [],
      },
      'ADAMANTINE-INGOT': {
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [],
      },
    },
  },

  RESOURCES: {
    'iron ingot': {
      resources: [{ type: 'IRON-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 1 }],
    },

    'copper ingot': {
      resources: [{ type: 'COPPER-ORE', quantity: 3 }],
      skills: [],
    },

    'silver ingot': {
      resources: [{ type: 'SILVER-ORE', quantity: 3 }],
      skills: [],
    },

    'gold ingot': {
      resources: [{ type: 'GOLD-ORE', quantity: 3 }],
      skills: [],
    },

    'mithril ingot': {
      resources: [{ type: 'MITHRIL-ORE', quantity: 3 }],
      skills: [],
    },

    'adamantine ingot': {
      resources: [{ type: 'ADAMANTINE-ORE', quantity: 3 }],
      skills: [],
    },
  },

  POTION: {},

  MISC: {},
};
