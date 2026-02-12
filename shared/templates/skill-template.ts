import { imageConfig } from '@/shared/config/image-config';
import type { SkillTemplate } from '@/shared/types';

export const skillsTemplate = [
  {
    id: '019bbdf2-c73e-74f8-87dd-a09e880e3295',
    name: 'Alchemy',
    image: imageConfig.icon.skill['ALCHEMY'],
    key: 'ALCHEMY',
  },
  {
    id: '019bbdf2-885f-7706-9377-ca21f3e40ef6',
    name: 'Blacksmithing',
    image: imageConfig.icon.skill['BLACKSMITHING'],
    key: 'BLACKSMITHING',
  },
  {
    id: '019c51fc-2163-78b7-be54-5761f6419737',
    name: 'Fishing',
    image: imageConfig.icon.skill['FISHING'],
    key: 'FISHING',
  },
  {
    id: '019c51fc-facf-773d-8391-69db6497a30c',
    name: 'Lumberjacking',
    image: imageConfig.icon.skill['LUMBERJACKING'],
    key: 'LUMBERJACKING',
  },
  {
    id: '019bbdf2-9a83-7858-b32a-e0e3cac7f65f',
    name: 'Mining',
    image: imageConfig.icon.skill['MINING'],
    key: 'MINING',
  },
  {
    id: '019bbdf2-b18f-7510-b49a-fece27cb6bbe',
    name: 'Smelting',
    image: imageConfig.icon.skill['SMELTING'],
    key: 'SMELTING',
  },

  {
    id: '019bbdf2-dc68-7e87-b983-8fe2f03b4c50',
    name: 'Tailoring',
    image: imageConfig.icon.skill['TAILORING'],
    key: 'TAILORING',
  },
  {
    id: '019c51ff-1fe6-79c1-8bf8-7cd2e9c89952',
    name: 'Cloth lore',
    image: imageConfig.icon.skill['CLOTH_LORE'],
    key: 'CLOTH_LORE',
  },
  {
    id: '019c51ff-ce04-7448-a1c9-547f49ae62f8',
    name: 'Ingot lore',
    image: imageConfig.icon.skill['INGOT_LORE'],
    key: 'INGOT_LORE',
  },
  {
    id: '019c5200-3fa0-7400-ae2e-3100dcc7b666',
    name: 'Leather lore',
    image: imageConfig.icon.skill['LEATHER_LORE'],
    key: 'LEATHER_LORE',
  },
  {
    id: '019c5200-7d6a-7d3a-8d88-cbf156719f2e',
    name: 'Wood lore',
    image: imageConfig.icon.skill['WOOD_LORE'],
    key: 'WOOD_LORE',
  },

  {
    id: '019bbdf2-f6cb-7263-8741-6da30e87dd35',
    name: 'Regeneration',
    image: imageConfig.icon.skill['REGENERATION'],
    key: 'REGENERATION',
  },
  {
    id: '019bbdf3-090f-79c1-80f2-2ca8c64e56fa',
    name: 'Meditation',
    image: imageConfig.icon.skill['MEDITATION'],
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
