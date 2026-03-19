import type { CreatureTemplate } from '@/shared/types';

import { imageConfig } from '../config/image-config';

export const creatureKeyValues = ['PIG', 'SHEEP', 'RAT'] as const;
export type CreatureKey = (typeof creatureKeyValues)[number];

export const creatureTemplate = [
  {
    id: '019cf851-85f4-76bd-ae12-be9e1f2808ac',
    type: 'ANIMAL',
    name: 'pig',
    key: 'PIG',
    image: imageConfig.creature.animal.pig,
    currentHealth: 100,
    currentMana: 0,
    maxHealth: 100,
    maxMana: 0,
    baseModifier: {
      strength: 5,
      constitution: 10,
      dexterity: 3,
    },
  },
  {
    id: '019cf870-846f-7a9f-beee-ee2628d7f053',
    type: 'ANIMAL',
    name: 'sheep',
    key: 'SHEEP',
    image: imageConfig.creature.animal.sheep,
    currentHealth: 70,
    currentMana: 0,
    maxHealth: 70,
    maxMana: 0,
    baseModifier: {
      strength: 14,
      constitution: 7,
      dexterity: 7,
    },
  },
  {
    id: '019d062f-79e2-7054-b6e9-c823838415c9',
    type: 'BEAST',
    name: 'rat',
    key: 'RAT',
    image: imageConfig.creature.beast.rat,
    currentHealth: 50,
    currentMana: 0,
    maxHealth: 50,
    maxMana: 0,
    baseModifier: {
      strength: 14,
      constitution: 5,
      dexterity: 10,
    },
  },
] as const satisfies CreatureTemplate[];

export const creatureTemplateById = creatureTemplate.reduce(
  (acc, c) => {
    acc[c.id] = c;
    return acc;
  },
  {} as Record<string, CreatureTemplate>,
);
export const creatureTemplateByKey = creatureTemplate.reduce(
  (acc, c) => {
    acc[c.key] = c;
    return acc;
  },
  {} as Record<CreatureKey, CreatureTemplate>,
);
