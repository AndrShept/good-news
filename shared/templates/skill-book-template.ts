import type { ItemTemplate, SkillTemplate } from '@/shared/types';

import { imageConfig } from '../config/image-config';
import { buffTemplateMapByName } from './buff-template';
import { skillTemplateByKey } from './skill-template';

export const skillBooks = [
  {
    id: 'f1c6bba6-8720-45e3-829b-68661b04933a',
    name: 'Alchemy skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Alchemy_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Alchemy skill. Allows you to begin training and gaining experience in Alchemy.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.ALCHEMY.key,
    },
  },

  {
    id: 'f495f264-ddb6-4449-9159-b14759dc4953',
    name: 'Blacksmithing skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Blacksmithing_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Blacksmithing skill. Allows you to begin training and gaining experience in Blacksmithing.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.BLACKSMITHING.key,
    },
  },
  {
    id: '6c12cb8e-7a82-40de-8908-9f7d95111f74',
    name: 'Fishing skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Fishing_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Fishing skill. Allows you to begin training and gaining experience in Fishing.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.FISHING.key,
    },
  },
  {
    id: 'b67a8d7a-86f9-4482-9256-5119cb314142',
    name: 'Lumberjacking skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Lumberjacking_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Lumberjacking skill. Allows you to begin training and gaining experience in Lumberjacking.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.LUMBERJACKING.key,
    },
  },
  {
    id: 'b09767ce-5acd-4ed4-a5c0-eddd44b37868',
    name: 'Mining skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Mining_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Mining skill. Allows you to begin training and gaining experience in Mining.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.MINING.key,
    },
  },
  {
    id: 'f62c1d52-5c28-40a2-bd46-e348b9c92eec',
    name: 'Smelting skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Smelting_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Smelting skill. Allows you to begin training and gaining experience in Smelting.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.SMELTING.key,
    },
  },
  {
    id: '05b2e4a4-971a-49a1-90c0-feda24a2ba9f',
    name: 'Tailoring skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Tailoring_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Tailoring skill. Allows you to begin training and gaining experience in Tailoring.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.TAILORING.key,
    },
  },
  {
    id: '68751e07-bb4f-42a2-bbfb-1eeaeefddb46',
    name: 'Cloth Lore skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Cloth_Lore_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Cloth Lore skill. Allows you to begin training and gaining experience in Cloth Lore.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.CLOTH_LORE.key,
    },
  },
  {
    id: 'f952e733-f5f9-49f8-9210-9c6290815b94',
    name: 'Ingot Lore skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Ingot_Lore_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Ingot Lore skill. Allows you to begin training and gaining experience in Ingot Lore.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.INGOT_LORE.key,
    },
  },
  {
    id: '5b3271f5-7cea-42dc-8290-cb2fcaccebb4',
    name: 'Leather Lore skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Leather_Lore_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Leather Lore skill. Allows you to begin training and gaining experience in Leather Lore.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.LEATHER_LORE.key,
    },
  },
  {
    id: '362c561a-c405-4ade-9aed-ed8e8e18b2f3',
    name: 'Wood Lore skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Wood_Lore_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Wood Lore skill. Allows you to begin training and gaining experience in Wood Lore.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.WOOD_LORE.key,
    },
  },
  {
    id: '355bd189-dfe6-45bc-bb69-11c32b66d1db',
    name: 'Regeneration skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Regeneration_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Regeneration skill. Allows you to begin training and gaining experience in Regeneration.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.REGENERATION.key,
    },
  },
  {
    id: 'f4a902cf-37be-4552-a491-9d597f2581c8',
    name: 'Meditation skill book',
    image: imageConfig.icon.book['unlock-skill'],
    key: 'Meditation_Skill_Book',
    type: 'SKILL_BOOK',
    description: 'Unlocks the Meditation skill. Allows you to begin training and gaining experience in Meditation.',
    stackable: false,
    bookInfo: {
      kind: 'UNLOCK',
      unlockSkillKey: skillTemplateByKey.MEDITATION.key,
    },
  },

  //// TRAIN BOOK  //////
  {
    id: 'a3e0b8e7-8bfe-4224-a88f-f0fadf6a33c1',
    name: 'Alchemy training tome',
    image: imageConfig.icon.book['train-skill'],
    key: 'Alchemy_Training_Tome',
    type: 'SKILL_BOOK',
    description: 'A comprehensive tome filled with advanced alchemical knowledge. After several hours of study, grants Alchemy experience.',
    stackable: false,
    bookInfo: {
      kind: 'TRAIN_BUFF',
      buffTemplateId: buffTemplateMapByName['Alchemist’s Insight'].id,
    },
  },
] as const satisfies ItemTemplate[];

const skillBookValues = skillBooks.map((s) => s.key);
type SkillBookKey = (typeof skillBookValues)[number];

export const skillBookTemplateById = skillBooks.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, ItemTemplate>,
);
export const skillBookTemplateByKey = skillBooks.reduce(
  (acc, template) => {
    acc[template.key] = template;
    return acc;
  },
  {} as Record<SkillBookKey, ItemTemplate>,
);
