import { imageConfig } from '@/shared/config/image-config';
import type { ItemTemplate, ResourceCategoryType, ResourceType } from '@/shared/types';
import { DEFAULT_ITEM_STACK } from '../shared-constants';

const createResource = (id: string, key: ResourceType, category: ResourceCategoryType, image: string): ItemTemplate => ({
  id,
  key,
  name: key.toLowerCase().replace(/_/g, ' '),
  image,
  type: 'RESOURCES',
  stackable: true,
  maxStack: DEFAULT_ITEM_STACK.RESOURCE,
  resourceInfo: {
    category,
  },
});

export const resourceTemplate = [
  // ===== ORE =====
  createResource('019f0000-0000-7000-8000-000000000001', 'IRON_ORE', 'ORE', imageConfig.icon.RESOURCES.ORE),
  createResource('019f0000-0000-7000-8000-000000000002', 'COPPER_ORE', 'ORE', imageConfig.icon.RESOURCES.ORE),
  createResource('019f0000-0000-7000-8000-000000000003', 'SILVER_ORE', 'ORE', imageConfig.icon.RESOURCES.ORE),
  createResource('019f0000-0000-7000-8000-000000000004', 'GOLD_ORE', 'ORE', imageConfig.icon.RESOURCES.ORE),
  createResource('019f0000-0000-7000-8000-000000000005', 'MITHRIL_ORE', 'ORE', imageConfig.icon.RESOURCES.ORE),
  createResource('019f0000-0000-7000-8000-000000000006', 'ADAMANTINE_ORE', 'ORE', imageConfig.icon.RESOURCES.ORE),

  // ===== INGOT =====
  createResource('019f0000-0000-7000-8000-000000000011', 'IRON_INGOT', 'INGOT', imageConfig.icon.RESOURCES.INGOT),
  createResource('019f0000-0000-7000-8000-000000000012', 'COPPER_INGOT', 'INGOT', imageConfig.icon.RESOURCES.INGOT),
  createResource('019f0000-0000-7000-8000-000000000013', 'SILVER_INGOT', 'INGOT', imageConfig.icon.RESOURCES.INGOT),
  createResource('019f0000-0000-7000-8000-000000000014', 'GOLD_INGOT', 'INGOT', imageConfig.icon.RESOURCES.INGOT),
  createResource('019f0000-0000-7000-8000-000000000015', 'MITHRIL_INGOT', 'INGOT', imageConfig.icon.RESOURCES.INGOT),
  createResource('019f0000-0000-7000-8000-000000000016', 'ADAMANTINE_INGOT', 'INGOT', imageConfig.icon.RESOURCES.INGOT),

  // ===== LOG =====
  createResource('019f0000-0000-7000-8000-000000000021', 'REGULAR_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000022', 'PINE_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000023', 'OAK_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000024', 'ASH_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000025', 'YEW_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000026', 'MAHOGANY_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000027', 'EBONY_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000028', 'BLOOD_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),
  createResource('019f0000-0000-7000-8000-000000000029', 'GHOST_LOG', 'LOG', imageConfig.icon.RESOURCES.LOG),

  // ===== PLANK =====
  createResource('019f0000-0000-7000-8000-000000000031', 'REGULAR_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000032', 'PINE_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000033', 'OAK_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000034', 'ASH_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000035', 'YEW_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000036', 'MAHOGANY_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000037', 'EBONY_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000038', 'BLOOD_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),
  createResource('019f0000-0000-7000-8000-000000000039', 'GHOST_PLANK', 'PLANK', imageConfig.icon.RESOURCES.PLANK),

  // ===== HIDE =====
  createResource('019f0000-0000-7000-8000-000000000041', 'REGULAR_HIDE', 'HIDE', imageConfig.icon.RESOURCES.HIDE),
  createResource('019f0000-0000-7000-8000-000000000042', 'ROUGH_HIDE', 'HIDE', imageConfig.icon.RESOURCES.HIDE),
  createResource('019f0000-0000-7000-8000-000000000043', 'REPTILE_HIDE', 'HIDE', imageConfig.icon.RESOURCES.HIDE),
  createResource('019f0000-0000-7000-8000-000000000044', 'IRON_HIDE', 'HIDE', imageConfig.icon.RESOURCES.HIDE),
  createResource('019f0000-0000-7000-8000-000000000045', 'DEMON_HIDE', 'HIDE', imageConfig.icon.RESOURCES.HIDE),
  createResource('019f0000-0000-7000-8000-000000000046', 'DRAGON_HIDE', 'HIDE', imageConfig.icon.RESOURCES.HIDE),

  // ===== LEATHER =====
  createResource('019f0000-0000-7000-8000-000000000051', 'REGULAR_LEATHER', 'LEATHER', imageConfig.icon.RESOURCES.LEATHER),
  createResource('019f0000-0000-7000-8000-000000000052', 'ROUGH_LEATHER', 'LEATHER', imageConfig.icon.RESOURCES.LEATHER),
  createResource('019f0000-0000-7000-8000-000000000053', 'REPTILE_LEATHER', 'LEATHER', imageConfig.icon.RESOURCES.LEATHER),
  createResource('019f0000-0000-7000-8000-000000000054', 'IRON_LEATHER', 'LEATHER', imageConfig.icon.RESOURCES.LEATHER),
  createResource('019f0000-0000-7000-8000-000000000055', 'DEMON_LEATHER', 'LEATHER', imageConfig.icon.RESOURCES.LEATHER),
  createResource('019f0000-0000-7000-8000-000000000056', 'DRAGON_LEATHER', 'LEATHER', imageConfig.icon.RESOURCES.LEATHER),

  // ===== FUR =====
  createResource('019f0000-0000-7000-8000-000000000061', 'REGULAR_FUR', 'FUR', imageConfig.icon.RESOURCES.FUR),
  createResource('019f0000-0000-7000-8000-000000000062', 'THICK_FUR', 'FUR', imageConfig.icon.RESOURCES.FUR),
  createResource('019f0000-0000-7000-8000-000000000063', 'DARK_FUR', 'FUR', imageConfig.icon.RESOURCES.FUR),
  createResource('019f0000-0000-7000-8000-000000000064', 'SHADOW_FUR', 'FUR', imageConfig.icon.RESOURCES.FUR),
  createResource('019f0000-0000-7000-8000-000000000065', 'SNOW_FUR', 'FUR', imageConfig.icon.RESOURCES.FUR),

  // ===== CURED FUR =====
  createResource('019f0000-0000-7000-8000-000000000071', 'REGULAR_CURED_FUR', 'CURED_FUR', imageConfig.icon.RESOURCES.CURED_FUR),
  createResource('019f0000-0000-7000-8000-000000000072', 'THICK_CURED_FUR', 'CURED_FUR', imageConfig.icon.RESOURCES.CURED_FUR),
  createResource('019f0000-0000-7000-8000-000000000073', 'DARK_CURED_FUR', 'CURED_FUR', imageConfig.icon.RESOURCES.CURED_FUR),
  createResource('019f0000-0000-7000-8000-000000000074', 'SHADOW_CURED_FUR', 'CURED_FUR', imageConfig.icon.RESOURCES.CURED_FUR),
  createResource('019f0000-0000-7000-8000-000000000075', 'SNOW_CURED_FUR', 'CURED_FUR', imageConfig.icon.RESOURCES.CURED_FUR),

  // ===== FIBER / CLOTH =====
  createResource('019f0000-0000-7000-8000-000000000081', 'COTTON', 'FIBER', imageConfig.icon.RESOURCES.COTTON),
  createResource('019f0000-0000-7000-8000-000000000082', 'FLAX', 'FIBER', imageConfig.icon.RESOURCES.FLAX),
  createResource('019f0000-0000-7000-8000-000000000083', 'REGULAR_CLOTH', 'CLOTH', imageConfig.icon.RESOURCES.CLOTH),

  // ===== BONE =====
  createResource('019f0000-0000-7000-8000-000000000091', 'REGULAR_BONE', 'BONE', imageConfig.icon.RESOURCES.BONE),

  // ===== MUSHROOMS =====
  createResource(
    '019f1000-0000-7000-8000-000000000092',
    'REDCAP_MUSHROOM',
    'MUSHROOM',
    imageConfig.icon.RESOURCES.mushrooms.REDCAP_MUSHROOM,
  ),
  createResource(
    '019f1000-0000-7000-8000-000000000093',
    'GLOWCAP_MUSHROOM',
    'MUSHROOM',
    imageConfig.icon.RESOURCES.mushrooms.GLOWCAP_MUSHROOM,
  ),
  createResource(
    '019f1000-0000-7000-8000-000000000094',
    'SHADOWCAP_MUSHROOM',
    'MUSHROOM',
    imageConfig.icon.RESOURCES.mushrooms.SHADOWCAP_MUSHROOM,
  ),
  createResource(
    '019f1000-0000-7000-8000-000000000095',
    'IRONCAP_MUSHROOM',
    'MUSHROOM',
    imageConfig.icon.RESOURCES.mushrooms.IRONCAP_MUSHROOM,
  ),
  createResource(
    '019f1000-0000-7000-8000-000000000096',
    'SPORECAP_MUSHROOM',
    'MUSHROOM',
    imageConfig.icon.RESOURCES.mushrooms.SPORECAP_MUSHROOM,
  ),
  createResource(
    '019f1000-0000-7000-8000-000000000097',
    'FROSTCAP_MUSHROOM',
    'MUSHROOM',
    imageConfig.icon.RESOURCES.mushrooms.FROSTCAP_MUSHROOM,
  ),

  // ===== HERBS =====
  createResource('019f1000-0000-7000-8000-000000000098', 'GREENLEAF', 'HERB', imageConfig.icon.RESOURCES.herbs.GREENLEAF),
  createResource('019f1000-0000-7000-8000-000000000099', 'SWIFTLEAF', 'HERB', imageConfig.icon.RESOURCES.herbs.SWIFTLEAF),
  createResource('019f1000-0000-7000-8000-000000000100', 'BITTERROOT', 'HERB', imageConfig.icon.RESOURCES.herbs.BITTERROOT),
  createResource('019f1000-0000-7000-8000-000000000101', 'SUNGRASS', 'HERB', imageConfig.icon.RESOURCES.herbs.SUNGRASS),
  createResource('019f1000-0000-7000-8000-000000000102', 'GHOST_HERB', 'HERB', imageConfig.icon.RESOURCES.herbs.GHOST_HERB),
  createResource('019f1000-0000-7000-8000-000000000103', 'BLOOD_HERB', 'HERB', imageConfig.icon.RESOURCES.herbs.BLOOD_HERB),
  createResource('019f1000-0000-7000-8000-000000000250', 'JASMINE', 'HERB', imageConfig.icon.RESOURCES.herbs.JASMINE),

  // ===== FLOWERS =====
  createResource('019f1000-0000-7000-8000-000000000104', 'ROSE', 'FLOWER', imageConfig.icon.RESOURCES.flowers.ROSE),
  createResource('019f1000-0000-7000-8000-000000000105', 'SUNFLOWER', 'FLOWER', imageConfig.icon.RESOURCES.flowers.SUNFLOWER),
  createResource('019f1000-0000-7000-8000-000000000106', 'BLUE_ORCHID', 'FLOWER', imageConfig.icon.RESOURCES.flowers.BLUE_ORCHID),
  createResource('019f1000-0000-7000-8000-000000000107', 'NIGHT_BLOOM', 'FLOWER', imageConfig.icon.RESOURCES.flowers.NIGHT_BLOOM),
  createResource('019f1000-0000-7000-8000-000000000108', 'FIRE_BLOSSOM', 'FLOWER', imageConfig.icon.RESOURCES.flowers.FIRE_BLOSSOM),
  createResource('019f1000-0000-7000-8000-000000000109', 'FROST_LILY', 'FLOWER', imageConfig.icon.RESOURCES.flowers.FROST_LILY),

   // ===== FISH =====
  createResource('019d73fa-54ab-7719-909f-4b927b8791b0', 'ANGLERFISH', 'FISH', imageConfig.icon.FOOD.fish.ANGLERFISH),
  createResource('019d73fb-4b7d-7c10-b38b-4ca38f1d6792', 'CARP', 'FISH', imageConfig.icon.FOOD.fish.CARP),
  createResource('019d73fb-8845-72fc-991d-df069155f0d3', 'CATFISH', 'FISH' ,imageConfig.icon.FOOD.fish.CATFISH),
  createResource('019d73fb-d214-79fc-9d52-be014ebe64fe', 'JELLYFISH', 'FISH', imageConfig.icon.FOOD.fish.JELLYFISH),
  createResource('019d73fc-1961-7d29-ab00-423bfdd21753', 'PERCH', 'FISH', imageConfig.icon.FOOD.fish.PERCH),
  createResource('019d73fc-4cd8-7acf-94d7-aaf06477f4cb', 'PUFFERFISH', 'FISH' ,imageConfig.icon.FOOD.fish.PUFFERFISH),
  createResource('019d73fc-cbc9-77f6-8ce5-89a47c24f094', 'SALMON', 'FISH', imageConfig.icon.FOOD.fish.SALMON),
  createResource('019d73fd-0578-75b7-8144-42b85c5fd1f4', 'SHARK', 'FISH', imageConfig.icon.FOOD.fish.SHARK),
  createResource('019d73fd-3a09-7503-9d7a-67ba4b0f9815', 'SMALL_FISH', 'FISH', imageConfig.icon.FOOD.fish.SMALL_FISH),
  createResource('019d73fd-8b70-7b68-93d0-3556914b5c43', 'SQUID', 'FISH', imageConfig.icon.FOOD.fish.SQUID),
  createResource('019d73fd-c841-76de-bc88-69dde97c2ac5', 'TUNA', 'FISH', imageConfig.icon.FOOD.fish.TUNA),
] as const satisfies ItemTemplate[];

// const resourceKeys = resourceTemplate.map((r) => r.key);
// export type ResourceKey = (typeof resourceKeys)[number];

export const resourceTemplateById = resourceTemplate.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, ItemTemplate>,
);

export const resourceTemplateByKey = resourceTemplate.reduce(
  (acc, template) => {
    acc[template.key as ResourceType] = template;
    return acc;
  },
  {} as Record<ResourceType, ItemTemplate>,
);
