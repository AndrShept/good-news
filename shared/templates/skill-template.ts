import { imageConfig } from '@/shared/config/image-config';
import type { SkillTemplate } from '@/shared/types';

export const skillCategoryValues = ['GATHERING', 'REFINING', 'CRAFTING', 'LORE', 'COMBAT', 'UTILITY'] as const;
export const skillKeyValues = [
  'SMELTING',
  'TANNING',
  'WEAVING',
  'SAWMILLING',

  'BLACKSMITHING',
  'TAILORING',
  'ALCHEMY',
  'CARPENTRY',

  'FISHING',
  'WOODCUTTING',
  'MINING',
  'SKINNING',
  'FORAGING',

  'ORE_LORE',
  'METAL_LORE',
  'HIDE_LORE',
  'LEATHER_LORE',
  'FUR_LORE',
  'CURED_FUR_LORE',
  'WOOD_LORE',
  'FLOWER_LORE',
  'MUSHROOM_LORE',
  'HERB_LORE',
  'FIBER_LORE',
  'CLOTH_LORE',
  'BONE_LORE',

  'REGENERATION',
  'MEDITATION',
] as const;

export type SkillKey = (typeof skillKeyValues)[number];
export type GatheringCategorySkillKey = Extract<SkillKey, 'FISHING' | 'WOODCUTTING' | 'MINING' | 'SKINNING' | 'FORAGING'>;
export type CraftingCategorySkillKey = Extract<SkillKey, 'BLACKSMITHING' | 'TAILORING' | 'ALCHEMY' | 'CARPENTRY'>;
export type RefiningCategorySkillKey = Extract<SkillKey, 'SMELTING' | 'TANNING' | 'WEAVING' | 'SAWMILLING'>;
export type LoreSkillKey = Extract<
  SkillKey,
  | 'ORE_LORE'
  | 'METAL_LORE'
  | 'HIDE_LORE'
  | 'LEATHER_LORE'
  | 'WOOD_LORE'
  | 'FIBER_LORE'
  | 'HERB_LORE'
  | 'FLOWER_LORE'
  | 'MUSHROOM_LORE'
  | 'CLOTH_LORE'
  | 'FUR_LORE'
  | 'CURED_FUR_LORE'
  | 'BONE_LORE'
>;

export const gatheringSkillKeysValues = [
  'FISHING',
  'FORAGING',
  'WOODCUTTING',
  'MINING',
  'SKINNING',
] as const satisfies GatheringCategorySkillKey[];

export const skillsTemplate = [
  {
    id: '019bbdf2-b18f-7510-b49a-fece27cb6bbe',
    name: 'Smelting',
    image: imageConfig.icon.skill['SMELTING'],
    category: 'REFINING',
    key: 'SMELTING',
  },
  {
    id: '019d24d1-7f71-7d7a-ae74-fbe433430242',
    name: 'Weaving',
    image: imageConfig.icon.skill['WEAVING'],
    category: 'REFINING',
    key: 'WEAVING',
  },
  {
    id: '019d24d2-012f-7577-8bb7-1279aded9b4a',
    name: 'Sawmilling',
    image: imageConfig.icon.skill['SAWMILLING'],
    category: 'REFINING',
    key: 'SAWMILLING',
  },
  {
    id: '019d24d3-5d5f-7e1c-822e-5d67801ea573',
    name: 'Tanning',
    image: imageConfig.icon.skill['TANNING'],
    category: 'REFINING',
    key: 'TANNING',
  },
  {
    id: '019bbdf2-c73e-74f8-87dd-a09e880e3295',
    name: 'Alchemy',
    image: imageConfig.icon.skill['ALCHEMY'],
    category: 'CRAFTING',
    key: 'ALCHEMY',
  },
  {
    id: '019bbdf2-885f-7706-9377-ca21f3e40ef6',
    name: 'Blacksmithing',
    image: imageConfig.icon.skill['BLACKSMITHING'],
    category: 'CRAFTING',
    key: 'BLACKSMITHING',
  },
  {
    id: '019bbdf2-dc68-7e87-b983-8fe2f03b4c50',
    name: 'Tailoring',
    image: imageConfig.icon.skill['TAILORING'],
    category: 'CRAFTING',
    key: 'TAILORING',
  },
  {
    id: 'c888818a-4847-43f7-8117-7d88cacb878a',
    name: 'Carpentry',
    image: imageConfig.icon.skill['CARPENTRY'],
    category: 'CRAFTING',
    key: 'CARPENTRY',
  },
  {
    id: '019c51fc-2163-78b7-be54-5761f6419737',
    name: 'Fishing',
    image: imageConfig.icon.skill['FISHING'],
    category: 'GATHERING',
    key: 'FISHING',
  },
  {
    id: '019c51fc-facf-773d-8391-69db6497a30c',
    name: 'Woodcutting',
    image: imageConfig.icon.skill.WOODCUTTING,
    category: 'GATHERING',
    key: 'WOODCUTTING',
  },
  {
    id: '019bbdf2-9a83-7858-b32a-e0e3cac7f65f',
    name: 'Mining',
    image: imageConfig.icon.skill['MINING'],
    category: 'GATHERING',
    key: 'MINING',
  },
  {
    id: 'c5d39944-bab8-4fd4-9a5b-065257402c20',
    name: 'Skinning',
    image: imageConfig.icon.skill['SKINNING'],
    category: 'GATHERING',
    key: 'SKINNING',
  },
  {
    id: 'a6ed4a4a-4ae9-4245-9b3a-cc0c37428493',
    name: 'Foraging',
    image: imageConfig.icon.skill['FORAGING'],
    category: 'GATHERING',
    key: 'FORAGING',
  },
  {
    id: '8cd2c0df-0d33-411d-9c8b-d4021ba39181',
    name: 'Ore lore',
    image: imageConfig.icon.skill['ORE_LORE'],
    category: 'LORE',
    key: 'ORE_LORE',
  },
  {
    id: '019c51ff-ce04-7448-a1c9-547f49ae62f8',
    name: 'Metal lore',
    image: imageConfig.icon.skill['METAL_LORE'],
    category: 'LORE',
    key: 'METAL_LORE',
  },
  {
    id: '019d24da-290a-751f-be3e-cd0fde172551',
    name: 'Hide lore',
    image: imageConfig.icon.skill['HIDE_LORE'],
    category: 'LORE',
    key: 'HIDE_LORE',
  },
  {
    id: '019c5200-3fa0-7400-ae2e-3100dcc7b666',
    name: 'Leather lore',
    image: imageConfig.icon.skill['LEATHER_LORE'],
    category: 'LORE',
    key: 'LEATHER_LORE',
  },
  {
    id: '019c5200-7d6a-7d3a-8d88-cbf156719f2e',
    name: 'Wood lore',
    image: imageConfig.icon.skill['WOOD_LORE'],
    category: 'LORE',
    key: 'WOOD_LORE',
  },

  {
    id: '4b35c972-6e4e-4cde-9beb-933906e6aa05',
    name: 'Herb lore',
    image: imageConfig.icon.skill['HERB_LORE'],
    category: 'LORE',
    key: 'HERB_LORE',
  },
  {
    id: '019d24d6-a7f0-7a46-aaea-b18749ff36d4',
    name: 'Flower lore',
    image: imageConfig.icon.skill['FLOWER_LORE'],
    category: 'LORE',
    key: 'FLOWER_LORE',
  },
  {
    id: '019d24d7-3123-7d2c-b046-0488cd14bd38',
    name: 'Mushroom lore',
    image: imageConfig.icon.skill['MUSHROOM_LORE'],
    category: 'LORE',
    key: 'MUSHROOM_LORE',
  },
  {
    id: '019d252c-7ec6-752e-b21c-385b0e9e50b0',
    name: 'Fiber lore',
    image: imageConfig.icon.skill['FIBER_LORE'],
    category: 'LORE',
    key: 'FIBER_LORE',
  },
  {
    id: '019c51ff-1fe6-79c1-8bf8-7cd2e9c89952',
    name: 'Cloth lore',
    image: imageConfig.icon.skill['CLOTH_LORE'],
    category: 'LORE',
    key: 'CLOTH_LORE',
  },

  {
    id: '019d24db-a962-77b3-8cc8-db81e166ad51',
    name: 'Fur lore',
    image: imageConfig.icon.skill['FUR_LORE'],
    category: 'LORE',
    key: 'FUR_LORE',
  },
  {
    id: '019d24dc-06bc-76ed-8f1f-a0d41def680b',
    name: 'Cured fur lore',
    image: imageConfig.icon.skill['FUR_LORE'],
    category: 'LORE',
    key: 'CURED_FUR_LORE',
  },

  {
    id: '019bbdf2-f6cb-7263-8741-6da30e87dd35',
    name: 'Regeneration',
    image: imageConfig.icon.skill['REGENERATION'],
    category: 'UTILITY',
    key: 'REGENERATION',
  },
  {
    id: '019bbdf3-090f-79c1-80f2-2ca8c64e56fa',
    name: 'Meditation',
    image: imageConfig.icon.skill['MEDITATION'],
    category: 'UTILITY',
    key: 'MEDITATION',
  },
] as const satisfies SkillTemplate[];

// export const skillKeyValues = skillsTemplate.map((s) => s.key);
// export type SkillKey = (typeof skillKeyValues)[number];

export const skillTemplateById = skillsTemplate.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, SkillTemplate>,
);
export const skillTemplateByKey = skillsTemplate.reduce(
  (acc, template) => {
    acc[template.key] = template;
    return acc;
  },
  {} as Record<SkillKey, SkillTemplate>,
);
