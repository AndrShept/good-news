import { Button } from '@/components/ui/button';
import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { useCreateContainerSlots } from '@/features/item-container/hooks/useCreateContainerSlots';
import { useHeroBackpack } from '@/features/item-container/hooks/useHeroBackpack';
import { LucideStepBack } from 'lucide-react';

import { useHero } from '../hooks/useHero';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';
import { CharacterStat } from './CharacterStat';
import { Paperdoll } from './Paperdoll';
import { CharacterModifier } from './CharacterModifier';

export const CharacterPaperdoll = () => {
  const hero = useHero((state) => ({
    id: state?.data?.id ?? '',
    name: state?.data?.name ?? '',
    avatarImage: state?.data?.avatarImage ?? '',
    characterImage: state?.data?.characterImage ?? '',
    currentExperience: state?.data?.currentExperience ?? 0,
    maxExperience: state?.data?.maxExperience ?? 0,
    currentHealth: state?.data?.currentHealth ?? 0,
    currentMana: state?.data?.currentMana ?? 0,
    freeStatPoints: state?.data?.freeStatPoints ?? 0,
    stat: state?.data?.stat,
    maxHealth: state?.data?.maxHealth ?? 0,
    maxMana: state?.data?.maxMana ?? 0,
    level: state?.data?.level ?? 0,
    modifier: state?.data?.modifier,
    equipments: state?.data?.equipments ?? [],
  }));
  const { mutate, isPending } = useHeroStateMutation();

  const { backpack } = useHeroBackpack();
  const containerSlots = useCreateContainerSlots(backpack?.maxSlots, backpack?.containerSlots);
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

        <ItemContainer containerSlots={containerSlots}  />
      </div>
    </section>
  );
};
