import { BackButton } from '@/components/BackButton';
import { HeroBackpack } from '@/features/item-container/components/HeroBackpack';
import { useGameUIStore } from '@/store/useGameUIStore';
import { useMediaQuery } from 'usehooks-ts';

import { useHero } from '../hooks/useHero';
import { CharacterModifier } from './CharacterModifier';
import { CharacterStat } from './CharacterStat';
import { Paperdoll } from './Paperdoll';

export const CharacterPaperdoll = () => {
  const hero = useHero((data) => ({
    id: data?.id ?? '',
    name: data?.name ?? '',
    avatarImage: data?.avatarImage ?? '',
    characterImage: data?.characterImage ?? '',
    currentHealth: data?.currentHealth ?? 0,
    currentMana: data?.currentMana ?? 0,
    freeStatPoints: data?.freeStatPoints ?? 0,
    stat: data?.stat,
    maxHealth: data?.maxHealth ?? 0,
    maxMana: data?.maxMana ?? 0,
    level: data?.level ?? 0,
    modifier: data?.modifier,
    equipments: data?.equipments ?? [],
    buffs: data?.buffs ?? [],
  }));
  const isMobile = useMediaQuery('(max-width: 768px)');
  const setHeaderUIType = useGameUIStore((state) => state.setHeaderUIType);
  return (
    <section className="mx-auto flex flex-col gap-1">
      <BackButton onClick={() => setHeaderUIType(null)} className="m-auto my-1" />
      <div className="flex flex-1 gap-4">
        <Paperdoll {...hero} />
        <div className="h-fit max-w-fit flex-col gap-2 rounded text-sm md:flex">
          <CharacterStat freeStatPoints={hero.freeStatPoints} heroStat={hero.stat} modifier={hero.modifier} />
          <CharacterModifier {...hero.modifier!} />
        </div>
        {!isMobile && <HeroBackpack />}
      </div>
    </section>
  );
};
