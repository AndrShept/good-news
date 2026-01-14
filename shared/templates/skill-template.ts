import { imageConfig } from '@/shared/config/image-config';
import type { SkillTemplate } from '@/shared/types';

export const skillKeyValues = ['BLACKSMITHING', 'MINING', 'SMELTING', 'ALCHEMY', 'TAILORING', 'REGENERATION', 'MEDITATION'] as const;
export type SkillKey = (typeof skillKeyValues)[number];

export const skillsTemplate = [
  {
    id: '019bbdf2-885f-7706-9377-ca21f3e40ef6',
    name: 'Blacksmithing',
    image: imageConfig.icon.skill['BLACKSMITHING'],
    key: 'BLACKSMITHING',
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
    id: '019bbdf2-c73e-74f8-87dd-a09e880e3295',
    name: 'Alchemy',
    image: imageConfig.icon.skill['ALCHEMY'],
    key: 'ALCHEMY',
  },
  {
    id: '019bbdf2-dc68-7e87-b983-8fe2f03b4c50',
    name: 'Tailoring',
    image: imageConfig.icon.skill['TAILORING'],
    key: 'TAILORING',
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
