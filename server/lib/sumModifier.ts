import type { Modifier, OmitModifier } from '@/shared/types';

interface ISumModifier {
  heroModifier: Modifier | null
  itemModifier: Modifier | OmitModifier | undefined;
}

export const sumModifier = ({ heroModifier, itemModifier }: ISumModifier) => {
  if (!itemModifier) return;
  const newModifier = {} as OmitModifier;
  for (let key in heroModifier) {
    const value = heroModifier[key as keyof OmitModifier];
    if (typeof value === 'number') {
      newModifier[key as keyof OmitModifier] = value + (itemModifier[key as keyof OmitModifier] ?? 0);
    }
  }
  return newModifier;
};
