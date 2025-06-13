import type { Modifier, OmitModifier } from '@/shared/types';

interface ISumModifier {
  heroModifier: Modifier;
  itemModifier: Modifier;
}

export const sumModifier = ({ heroModifier, itemModifier }: ISumModifier) => {
  const newModifier = {} as OmitModifier;
  for (let key in heroModifier) {
    const value = heroModifier[key as keyof OmitModifier];
    if (typeof value === 'number') {
      console.log(value);
      newModifier[key as keyof OmitModifier] = value + itemModifier[key as keyof OmitModifier];
    }
  }
  return newModifier;
};
