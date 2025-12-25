import { Button } from '@/components/ui/button';
import { HeroBackpack } from '@/features/item-container/components/HeroBackpack';
import { LucideStepBack } from 'lucide-react';

import { useHero } from '../hooks/useHero';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';
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
    
  }));
  const { mutate, isPending } = useHeroStateMutation();

  return (
    <section className="flex flex-col gap-1">
      <Button variant="outline" disabled={isPending} onClick={() => mutate('IDLE')} className="ml-auto w-fit">
        <LucideStepBack />
        Back
      </Button>
      <div className="flex gap-4">
        <Paperdoll {...hero} />
        <div className="h-fit max-w-fit flex-col gap-2 rounded text-sm md:flex">
          <CharacterStat freeStatPoints={hero.freeStatPoints} heroStat={hero.stat} modifier={hero.modifier} />
          <CharacterModifier {...hero.modifier!} />
        </div>
        <HeroBackpack />
      </div>
    </section>
  );
};
