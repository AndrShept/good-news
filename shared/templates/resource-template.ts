import { imageConfig } from '@/shared/config/image-config';
import { DEFAULT_ITEM_STACK } from '@/shared/constants';
import type { ItemTemplate } from '@/shared/types';

export const resourceKeyValues = [
  'IRON_ORE',
  'COPPER_ORE',
  'SILVER_ORE',
  'GOLD_ORE',
  'MITHRIL_ORE',
  'ADAMANTINE_ORE',
  'IRON_INGOT',
  'COPPER_INGOT',
  'SILVER_INGOT',
  'GOLD_INGOT',
  'MITHRIL_INGOT',
  'ADAMANTINE_INGOT',
  'REGULAR_LEATHER',
] as const;
export type ItemTemplateKey = (typeof resourceKeyValues)[number];

export const resourceTemplate = [
  {
    id: '0199df54-be65-7db2-af0a-1002d323d64d',
    key: 'IRON_ORE',
    name: 'iron ore',
    image: imageConfig.icon.RESOURCES['IRON-ORE'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'ORE',
    },
  },
  {
    id: '0199df74-c722-7695-96d9-59a701689d03',
    key: 'COPPER_ORE',
    name: 'copper ore',
    image: imageConfig.icon.RESOURCES['COPPER-ORE'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'ORE',
    },
  },
  {
    id: '019ac735-a9c0-7e79-98cb-e392af762b03',
    key: 'SILVER_ORE',
    name: 'silver ore',
    image: imageConfig.icon.RESOURCES['SILVER-ORE'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'ORE',
    },
  },
  {
    id: '019ac738-6ec9-7763-b633-d5ed4046b6f0',
    key: 'GOLD_ORE',
    name: 'gold ore',
    image: imageConfig.icon.RESOURCES['GOLD-ORE'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'ORE',
    },
  },
  {
    id: '019ac738-e2f2-79a0-9f96-968231e0853e',
    key: 'MITHRIL_ORE',
    name: 'mithril ore',
    image: imageConfig.icon.RESOURCES['MITHRIL-ORE'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'ORE',
    },
  },
  {
    id: '019ac739-be74-7813-9a75-8e8b0710a51e',
    key: 'ADAMANTINE_ORE',
    name: 'adamantine ore',
    image: imageConfig.icon.RESOURCES['ADAMANTINE-ORE'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'ORE',
    },
  },
  {
    id: '019ac73a-d3f4-7c91-90b5-e0756f68d876',
    key: 'IRON_INGOT',
    name: 'iron ingot',
    image: imageConfig.icon.RESOURCES['IRON-INGOT'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'INGOT',
    },
  },
  {
    id: '019ac73d-200f-7bf0-9afc-567a9fbe6a37',
    key: 'COPPER_INGOT',
    name: 'copper ingot',
    image: imageConfig.icon.RESOURCES['COPPER-INGOT'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'INGOT',
    },
  },
  {
    id: '019ac73d-d28e-7d2f-87ed-3de08098de4f',
    key: 'SILVER_INGOT',
    name: 'silver ingot',
    image: imageConfig.icon.RESOURCES['SILVER-INGOT'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'INGOT',
    },
  },
  {
    id: '019ac73e-4757-7ab9-9483-b90209e9761a',
    key: 'GOLD_INGOT',
    name: 'gold ingot',
    image: imageConfig.icon.RESOURCES['GOLD-INGOT'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'INGOT',
    },
  },
  {
    id: '019ac73e-bd49-739f-a996-78e034cdb769',
    key: 'MITHRIL_INGOT',
    name: 'mithril ingot',
    image: imageConfig.icon.RESOURCES['MITHRIL-INGOT'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'INGOT',
    },
  },
  {
    id: '019ac73f-2e95-78cf-b9c5-f8e7f33e960d',
    key: 'ADAMANTINE_INGOT',
    name: 'adamantine ingot',
    image: imageConfig.icon.RESOURCES['ADAMANTINE-INGOT'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'INGOT',
    },
  },
  {
    id: '019abb58-1d6a-7b1f-b277-409189ddfc64',
    key: 'REGULAR_LEATHER',
    name: 'regular leather',
    image: imageConfig.icon.RESOURCES['REGULAR-LEATHER'],
    type: 'RESOURCES',
    stackable: true,
    maxStack: DEFAULT_ITEM_STACK.RESOURCE,
    resourceInfo: {
      category: 'LEATHER',
    },
  },
] as const satisfies ItemTemplate[];

export const resourceTemplateById = resourceTemplate.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, ItemTemplate>,
);
export const resourceTemplateByKey = resourceTemplate.reduce(
  (acc, template) => {
    acc[template.key] = template;
    return acc;
  },
  {} as Record<ItemTemplateKey, ItemTemplate>,
);
