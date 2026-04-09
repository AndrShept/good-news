import { imageConfig } from '@/shared/config/image-config';
import { DEFAULT_ITEM_STACK } from '@/shared/constants';
import type { FishType, ItemTemplate } from '@/shared/types';

const createFood = (id: string, key: FishType, image: string): ItemTemplate => ({
  id,
  key,
  name: key.toLowerCase().replace(/_/g, ' '),
  image,
  type: 'FOOD',
  stackable: true,
  maxStack: DEFAULT_ITEM_STACK.FOOD,
});

export const foodTemplate = [

  // ===== FISH =====
  createFood('019d73fa-54ab-7719-909f-4b927b8791b0', 'ANGLERFISH', imageConfig.icon.FOOD.fish.ANGLERFISH),
  createFood('019d73fb-4b7d-7c10-b38b-4ca38f1d6792', 'CARP', imageConfig.icon.FOOD.fish.CARP),
  createFood('019d73fb-8845-72fc-991d-df069155f0d3', 'CATFISH', imageConfig.icon.FOOD.fish.CATFISH),
  createFood('019d73fb-d214-79fc-9d52-be014ebe64fe', 'JELLYFISH', imageConfig.icon.FOOD.fish.JELLYFISH),
  createFood('019d73fc-1961-7d29-ab00-423bfdd21753', 'PERCH', imageConfig.icon.FOOD.fish.PERCH),
  createFood('019d73fc-4cd8-7acf-94d7-aaf06477f4cb', 'PUFFERFISH', imageConfig.icon.FOOD.fish.PUFFERFISH),
  createFood('019d73fc-cbc9-77f6-8ce5-89a47c24f094', 'SALMON', imageConfig.icon.FOOD.fish.SALMON),
  createFood('019d73fd-0578-75b7-8144-42b85c5fd1f4', 'SHARK', imageConfig.icon.FOOD.fish.SHARK),
  createFood('019d73fd-3a09-7503-9d7a-67ba4b0f9815', 'SMALL_FISH', imageConfig.icon.FOOD.fish.SMALL_FISH),
  createFood('019d73fd-8b70-7b68-93d0-3556914b5c43', 'SQUID', imageConfig.icon.FOOD.fish.SQUID),
  createFood('019d73fd-c841-76de-bc88-69dde97c2ac5', 'TUNA', imageConfig.icon.FOOD.fish.TUNA),
] as const satisfies ItemTemplate[];

export const foodTemplateById = foodTemplate.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, ItemTemplate>,
);

export const foodTemplateByKey = foodTemplate.reduce(
  (acc, template) => {
    acc[template.key as FishType] = template;
    return acc;
  },
  {} as Record<FishType, ItemTemplate>,
);
