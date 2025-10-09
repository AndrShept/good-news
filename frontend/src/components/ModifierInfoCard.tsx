import { Modifier, OmitModifier } from '@/shared/types';

interface Props {
  modifier: Modifier | undefined | null;
}
export const ModifierInfoCard = ({ modifier }: Props) => {
  const modifierChangeName = (modifier: keyof OmitModifier) => {
    const variants: Record<keyof OmitModifier, string> = {
      minDamage: 'min damage',
      maxDamage: 'max damage',
      strength: 'strength',
      dexterity: 'dexterity',
      intelligence: 'intelligence',
      constitution: 'constitution',
      luck: 'luck',
      defense: 'defense',
      evasion: 'evasion',
      magicResistance: 'magic resistance',
      healthRegen: 'health regen',
      manaRegen: 'mana regen',
      maxHealth: 'max health',
      maxMana: 'max mana',
      physDamage: 'phys damage',
      physCritChance: 'phys crit chance',
      physCritPower: 'phys crit power',
      spellDamage: 'spell damage',
      spellCritChance: 'spell crit chance',
      spellCritPower: 'spell crit power',
      spellHitChance: 'spell hit chance',
      restoreHealth: 'health',
      restoreMana: 'mana',
    };
    return variants[modifier];
  };

  const modifiers =
    modifier &&
    Object.entries(modifier)
      .map(([key, value]) => ({
        name: modifierChangeName(key as keyof OmitModifier),
        value: value,
      }))
      .filter((item) => Boolean(Number(item.value)));
  return (
    <ul className="mt-2 flex flex-col gap-0.5 text-[15px]">
      {modifiers?.map((modifier) => (
        <li key={modifier.name} className="flex items-center gap-1">
          <p className="text-green-500">+{modifier.value}</p>
          <p className="text-muted-foreground">{modifier.name}</p>
        </li>
      ))}
    </ul>
  );
};
