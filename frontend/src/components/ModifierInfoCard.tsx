import { modifierChangeName } from '@/lib/utils';
import { Modifier, OmitModifier } from '@/shared/types';

interface Props {
  modifier: Partial<OmitModifier> | undefined | null;
}
export const ModifierInfoCard = ({ modifier }: Props) => {
 

  const modifiers =
    modifier &&
    Object.entries(modifier)
      .map(([key, value]) => ({
        name: modifierChangeName(key as keyof OmitModifier),
        value: value,
      }))
      .filter((item) => Boolean(Number(item.value)));
  return (
    <ul className="flex flex-col gap-0.5 text-[15px]">
      {modifiers?.map((modifier) => (
        <li key={modifier.name} className="flex items-center gap-1">
          <p className="text-green-500">+{modifier.value}</p>
          <p className="text-muted-foreground">{modifier.name}</p>
        </li>
      ))}
    </ul>
  );
};
