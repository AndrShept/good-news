import { imageConfig } from '@/shared/config/image-config';
import type { BuffTemplate } from '@/shared/types';

export const buffTemplate = [
  {
    id: '019b946f-742c-7627-9de6-73af060a03e4',
    name: 'Effect of Might',
    image: imageConfig.icon.POTION.buff.strength,
    type: 'POSITIVE',
    duration: 60 * 60 * 1000,
    modifier: { strength: 8 },
  },
  {
    id: '019b9470-df1c-7946-a8cf-1c4083a34253',
    name: 'Effect of Vitality',
    image: imageConfig.icon.POTION.buff.constitution,
    type: 'POSITIVE',
    duration: 60 * 1000,
    modifier: { constitution: 8 },
  },
  {
    id: '019b94b9-0900-7d19-8f06-43a153ae7c94',
    name: 'Effect of Clarity',
    image: imageConfig.icon.POTION.buff.intelligence,
    type: 'POSITIVE',
    duration: 60 * 60 * 1000,
    modifier: { wisdom: 8 },
  },
  {
    id: '019bb762-7011-7230-b9eb-1a9ece3a7700',
    name: 'Effect of Arcane',
    image: imageConfig.icon.POTION.buff.intelligence,
    type: 'POSITIVE',
    duration: 60 * 60 * 1000,
    modifier: { intelligence: 8 },
  },
  {
    id: '019b94b9-c90d-7961-a800-9213835a04ab',
    name: 'Effect of Agility',
    image: imageConfig.icon.POTION.buff.dexterity,
    type: 'POSITIVE',
    duration: 60 * 60 * 1000,
    modifier: { dexterity: 8 },
  },
  {
    id: '019b94ba-985f-71b2-b657-549b6c411139',
    name: 'Effect of Fortune',
    image: imageConfig.icon.POTION.buff.luck,
    type: 'POSITIVE',
    duration: 60 * 60 * 1000,
    modifier: { luck: 8 },
  },
] as const satisfies BuffTemplate[];

const names = buffTemplate.map((i) => i.name);
type BuffTemplateName = (typeof names)[number];

export const buffTemplateMap = buffTemplate.reduce(
  (acc, template) => {
    acc[template.name] = template;
    return acc;
  },
  {} as Record<BuffTemplateName, BuffTemplate>,
);
export const buffTemplateMapIds = buffTemplate.reduce(
  (acc, template) => {
    acc[template.id] = template;
    return acc;
  },
  {} as Record<string, BuffTemplate>,
);
