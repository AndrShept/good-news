import type { CreatureTemplate } from '@/shared/types';

import { imageConfig } from '../config/image-config';

export const creatureKeyValues = ['PIG', 'SHEEP'] as const;
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
