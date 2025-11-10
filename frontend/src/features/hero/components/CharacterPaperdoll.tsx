import { Button } from '@/components/ui/button';
import { getItemContainerByTypeOptions } from '@/features/item-container/api/get-item-container-by-type';
import { ItemContainer } from '@/features/item-container/components/ItemContainer';
import { useSuspenseQuery } from '@tanstack/react-query';
import { LucideStepBack } from 'lucide-react';
import { useMemo, useState } from 'react';

import { CraftModal } from '../../craft/components/CraftModal';
import { useHero } from '../hooks/useHero';
import { useHeroId } from '../hooks/useHeroId';
import { useHeroStateMutation } from '../hooks/useHeroStateMutation';
import { CharacterModifier } from './CharacterModifier';
import { CharacterStat } from './CharacterStat';
import { Paperdoll } from './Paperdoll';

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

  const id = useHeroId();
  const { data } = useSuspenseQuery(getItemContainerByTypeOptions(id, 'BACKPACK'));
  const containerSlots = useMemo(() => {
    return Array.from({ length: data?.maxSlots ?? 1 }, (_, idx) => {
      const item = data?.containerSlots?.[idx];
      if (item) {
        return item;
      }
      return null;
    });
  }, [data?.containerSlots, data?.maxSlots]);
  return (
    <section className="flex flex-col gap-1">
      <CraftModal />

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

        <ItemContainer containerSlots={containerSlots} type={data.type} />
      </div>
    </section>
  );
};
