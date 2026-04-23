import { imageConfig } from '@/shared/config/image-config';
import type { FishType, ItemTemplate } from '@/shared/types';
import { DEFAULT_ITEM_STACK } from '../shared-constants';

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

 
] as const satisfies ItemTemplate[];

// export const foodTemplateById = foodTemplate.reduce(
//   (acc, template) => {
//     acc[template.id] = template;
//     return acc;
//   },
//   {} as Record<string, ItemTemplate>,
// );

// export const foodTemplateByKey = foodTemplate.reduce(
//   (acc, template) => {
//     acc[template.key as FishType] = template;
//     return acc;
//   },
//   {} as Record<FishType, ItemTemplate>,
// );
