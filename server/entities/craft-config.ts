import type { ArmorType, CraftItemRequiredResources, ResourceType } from '@/shared/types';

import type { ArmorNameType } from './armor';
import { type WeaponNameType, weaponEntities } from './weapon';

interface ICraftConfig {
  WEAPON: Record<WeaponNameType, Record<ResourceType, CraftItemRequiredResources[]>>;
  ARMOR: Record<ArmorNameType, Record<ResourceType, CraftItemRequiredResources[]>>;
}

export const craftConfig: ICraftConfig = {
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
    'Simple gloves': {
      IRON: [{ type: 'IRON', quantity: 5 }],
      COPPER: [{ type: 'COPPER', quantity: 5 }],
      SILVER: [{ type: 'SILVER', quantity: 5 }],
      GOLD: [{ type: 'GOLD', quantity: 5 }],
      MITHRIL: [{ type: 'MITHRIL', quantity: 5 }],
      ADAMANTINE: [{ type: 'ADAMANTINE', quantity: 5 }],
    },
    plate: {
      IRON: [{ type: 'IRON', quantity: 10 }],
      COPPER: [{ type: 'COPPER', quantity: 10 }],
      SILVER: [{ type: 'SILVER', quantity: 10 }],
      GOLD: [{ type: 'GOLD', quantity: 10 }],
      MITHRIL: [{ type: 'MITHRIL', quantity: 10 }],
      ADAMANTINE: [{ type: 'ADAMANTINE', quantity: 10 }],
    },
  },
};
