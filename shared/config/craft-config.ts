import type {
  ArmorSlotType,
  ArmorType,
  CraftItemRequirement,
  GameItemType,
  IngotType,
  LeatherType,
  ResourceType,
  WeaponType,
} from '@/shared/types';

import { armorEntities } from '../../server/entities/armor';
import { resourceEntities } from '../../server/entities/resource';
import { shieldEntities } from '../../server/entities/shield';
import { weaponEntities } from '../../server/entities/weapon';

function isIngot(
  r: (typeof resourceEntities)[number],
): r is Extract<(typeof resourceEntities)[number], { resource: { category: 'INGOT' } }> {
  return r.resource.category === 'INGOT';
}
function isOre(r: (typeof resourceEntities)[number]): r is Extract<(typeof resourceEntities)[number], { resource: { category: 'ORE' } }> {
  return r.resource.category === 'ORE';
}
function isLeather(
  r: (typeof resourceEntities)[number],
): r is Extract<(typeof resourceEntities)[number], { resource: { category: 'LEATHER' } }> {
  return r.resource.category === 'LEATHER';
}

const weaponNames = weaponEntities.map((weapon) => weapon.name);
const armorNames = armorEntities.map((armor) => armor.name);
const shieldNames = shieldEntities.map((shield) => shield.name);
const ingotNames = resourceEntities.filter(isIngot).map((i) => i.name);

export type WeaponNameType = (typeof weaponNames)[number];
export type ArmorNameType = (typeof armorNames)[number];
export type ShieldNameType = (typeof shieldNames)[number];
export type IngotName = (typeof ingotNames)[number];

export interface ICraftConfig {
  WEAPON: Record<WeaponType, Record<IngotType, CraftItemRequirement<IngotType>>>;
  ARMOR: Record<ArmorType, Record<LeatherType | IngotType, CraftItemRequirement<LeatherType | IngotType>>>;
  SHIELD: Record<ShieldNameType, Record<IngotType, CraftItemRequirement<IngotType>>>;
  RESOURCES: Record<string, CraftItemRequirement>;
  POTION: Record<string, CraftItemRequirement>;
  MISC: Record<string, CraftItemRequirement>;
  ACCESSORY: Record<string, CraftItemRequirement>;
}

export const craftConfig: ICraftConfig = {
  WEAPON: {
    SWORD: {
      'IRON-INGOT': { craftTime: 10000, resources: [{ type: 'IRON-INGOT', quantity: 10 }], skills: [{ type: 'BLACKSMITHING', level: 1 }] },
      'COPPER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'SILVER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'GOLD-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'MITHRIL-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'ADAMANTINE-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
    },
    DAGGER: {
      'IRON-INGOT': { craftTime: 10000, resources: [{ type: 'IRON-INGOT', quantity: 5 }], skills: [{ type: 'BLACKSMITHING', level: 1 }] },
      'COPPER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'COPPER-INGOT', quantity: 5 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'SILVER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'SILVER-INGOT', quantity: 5 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'GOLD-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'MITHRIL-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'MITHRIL-INGOT', quantity: 5 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'ADAMANTINE-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 5 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
    },
    AXE: {
      'IRON-INGOT': { craftTime: 10000, resources: [{ type: 'IRON-INGOT', quantity: 10 }], skills: [{ type: 'BLACKSMITHING', level: 1 }] },
      'COPPER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'SILVER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'GOLD-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'MITHRIL-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'ADAMANTINE-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
    },
    STAFF: {
      'IRON-INGOT': { craftTime: 10000, resources: [{ type: 'IRON-INGOT', quantity: 10 }], skills: [{ type: 'BLACKSMITHING', level: 1 }] },
      'COPPER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'SILVER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'GOLD-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'MITHRIL-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'ADAMANTINE-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
    },
  },

  ARMOR: {
    PLATE: {
      'REGULAR-LEATHER': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'IRON-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'COPPER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'SILVER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'GOLD-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'MITHRIL-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'ADAMANTINE-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
    },
    MAIL: {
      'REGULAR-LEATHER': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'IRON-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'COPPER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'SILVER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'GOLD-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'MITHRIL-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'ADAMANTINE-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
    },
    LEATHER: {
      'REGULAR-LEATHER': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'IRON-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'COPPER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'SILVER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'GOLD-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'MITHRIL-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'ADAMANTINE-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
    },
    CLOTH: {
      'REGULAR-LEATHER': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'IRON-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'COPPER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'SILVER-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'GOLD-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'MITHRIL-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
      'ADAMANTINE-INGOT': {
        resources: [],
        skills: [],
        craftTime: 0,
      },
    },
  },
  SHIELD: {
    'regular shield': {
      'IRON-INGOT': { craftTime: 13000, resources: [{ type: 'IRON-INGOT', quantity: 10 }], skills: [{ type: 'BLACKSMITHING', level: 1 }] },
      'COPPER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'COPPER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'SILVER-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'SILVER-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'GOLD-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'GOLD-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'MITHRIL-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'MITHRIL-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
      'ADAMANTINE-INGOT': {
        craftTime: 10000,
        resources: [{ type: 'ADAMANTINE-INGOT', quantity: 10 }],
        skills: [{ type: 'BLACKSMITHING', level: 1 }],
      },
    },
  },

  RESOURCES: {
    'iron ingot': {
      resources: [{ type: 'IRON-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 1 }],
      craftTime: 7000,
    },

    'copper ingot': {
      resources: [{ type: 'COPPER-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 5 }],
      craftTime: 7000,
    },

    'silver ingot': {
      resources: [{ type: 'SILVER-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 10 }],
      craftTime: 7000,
    },

    'gold ingot': {
      resources: [{ type: 'GOLD-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 20 }],
      craftTime: 7000,
    },

    'mithril ingot': {
      resources: [{ type: 'MITHRIL-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 1 }],
      craftTime: 7000,
    },

    'adamantine ingot': {
      resources: [{ type: 'ADAMANTINE-ORE', quantity: 3 }],
      skills: [{ type: 'SMELTING', level: 10 }],
      craftTime: 7000,
    },
  },

  POTION: {},

  MISC: {},
  ACCESSORY: {},
};
