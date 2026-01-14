import { imageConfig } from '@/shared/config/image-config';
import type { SkillTemplate } from '@/shared/types';

import { generateRandomUuid } from '../lib/utils';

export const skillsTemplate = [
  {
    id: generateRandomUuid(),
    name: 'Blacksmithing',
    image: imageConfig.icon.skill['BLACKSMITHING'],
  },
  {
    id: generateRandomUuid(),
    name: 'Mining',
    image: imageConfig.icon.skill['MINING'],
  },
  {
    id: generateRandomUuid(),
    name: 'Smelting',
    image: imageConfig.icon.skill['SMELTING'],
  },
  {
    id: generateRandomUuid(),
    name: 'Tailoring',
    image: imageConfig.icon.skill['TAILORING'],
  },
  {
    id: generateRandomUuid(),
    name: 'Regeneration',
    image: imageConfig.icon.skill['REGENERATION'],
  },
  {
    id: generateRandomUuid(),
    name: 'Meditation',
    image: imageConfig.icon.skill['MEDITATION'],
  },
] as const satisfies SkillTemplate[];
const names = skillsTemplate.map((i) => i.name);
type SkillTemplateName = (typeof names)[number];

export const skillTemplateMap = skillsTemplate.reduce(
  (acc, template) => {
    acc[template.name] = template;
    return acc;
  },
  {} as Record<SkillTemplateName, SkillTemplate>,
);
