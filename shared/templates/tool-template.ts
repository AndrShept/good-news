import type { ItemTemplate } from '@/shared/types';

import { imageConfig } from '../config/image-config';
import { skillTemplateByKey } from './skill-template';

export const toolsTemplate = [
  {
    id: '68a22135-999b-4d80-b066-9f34214a37ed',
    name: 'blacksmith hammer',
    key: 'Blacksmith_Hammer',
    image: imageConfig.equipments.tools['blacksmith-hammer'],
    type: 'TOOL',
    stackable: false,

    equipInfo: {
      weaponHand: 'ONE_HANDED',
      weaponType: 'MACE',
    },
    toolInfo: {
      skillTemplateId: skillTemplateByKey.BLACKSMITHING.id,
    },

    coreModifier: {
      minDamage: 5,
      maxDamage: 10,
    },
  },
  {
    id: '072b55ff-0ce8-455f-ad2a-7dc879ab2490',
    name: 'fishing rod',
    key: 'Fishing_Rod',
    image: imageConfig.equipments.tools['fishing-rod'],
    type: 'TOOL',
    stackable: false,

    equipInfo: {
      weaponHand: 'TWO_HANDED',
      weaponType: 'STAFF',
    },
    toolInfo: {
      skillTemplateId: skillTemplateByKey.FISHING.id,
    },

    coreModifier: {
      minDamage: 5,
      maxDamage: 9,
    },
  },
  {
    id: 'a2928cb2-1069-48df-965a-1a2fa15fabad',
    name: 'lumber axe',
    key: 'Lumber-Axe',
    image: imageConfig.equipments.tools['lumber-axe'],
    type: 'TOOL',
    stackable: false,

    equipInfo: {
      weaponHand: 'TWO_HANDED',
      weaponType: 'AXE',
    },
    toolInfo: {
      skillTemplateId: skillTemplateByKey.LUMBERJACKING.id,
    },

    coreModifier: {
      minDamage: 7,
      maxDamage: 13,
    },
  },
  {
    id: '6a6bbd66-fce8-40b4-902c-7409801aa84d',
    name: 'mining pickaxe',
    key: 'Mining_Pickaxe',
    image: imageConfig.equipments.tools['mining-pickaxe'],
    type: 'TOOL',
    stackable: false,

    equipInfo: {
      weaponHand: 'ONE_HANDED',
      weaponType: 'SWORD',
    },
    toolInfo: {
      skillTemplateId: skillTemplateByKey.MINING.id,
    },

    coreModifier: {
      minDamage: 6,
      maxDamage: 9,
    },
  },
] as const satisfies ItemTemplate[];

const toolKeys = toolsTemplate.map((w) => w.key);

type ToolKeyType = (typeof toolKeys)[number];
export const toolTemplateByKey = toolsTemplate.reduce(
  (acc, item) => {
    acc[item.key] = item;

    return acc;
  },
  {} as Record<ToolKeyType, ItemTemplate>,
);
