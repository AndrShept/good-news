import { imageConfig } from '@/shared/config/image-config';
import type { SkillTemplate } from '@/shared/types';

export const skillCategoryValues = ['GATHERING', 'PROCESSING', 'CRAFTING', 'LORE', 'COMBAT', 'UTILITY'] as const;

export const skillsTemplate = [
  {
    id: '019bbdf2-b18f-7510-b49a-fece27cb6bbe',
    name: 'Smelting',
    image: imageConfig.icon.skill['SMELTING'],
    category: 'PROCESSING',
    key: 'SMELTING',
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
    name: 'Lumberjacking',
    image: imageConfig.icon.skill['LUMBERJACKING'],
    category: 'GATHERING',
    key: 'LUMBERJACKING',
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
    id: '019c51ff-1fe6-79c1-8bf8-7cd2e9c89952',
    name: 'Cloth lore',
    image: imageConfig.icon.skill['CLOTH_LORE'],
    category: 'LORE',
    key: 'CLOTH_LORE',
  },
  {
    id: '019c51ff-ce04-7448-a1c9-547f49ae62f8',
    name: 'Ingot lore',
    image: imageConfig.icon.skill['INGOT_LORE'],
    category: 'LORE',
    key: 'INGOT_LORE',
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
    id: '8cd2c0df-0d33-411d-9c8b-d4021ba39181',
    name: 'Ore lore',
    image: imageConfig.icon.skill['ORE_LORE'],
    category: 'LORE',
    key: 'ORE_LORE',
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

export const skillKeyValues = skillsTemplate.map((s) => s.key);
export type SkillKey = (typeof skillKeyValues)[number];

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
