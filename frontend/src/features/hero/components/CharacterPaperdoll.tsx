import { Button } from '@/components/ui/button';
import { LucideStepBack } from 'lucide-react';

import { useHero } from '../hooks/useHero';
import { useHeroSetState } from '../hooks/useHeroSetState';
import { Inventory } from './Inventory';
import { Modifiers } from './Modifier';
import { Paperdoll } from './Paperdoll';

export const CharacterPaperdoll = () => {
  const { avatarImage, currentExperience, currentHealth, equipments, id, level, maxExperience, maxHealth, maxMana, name, currentMana } =
    useHero((state) => ({
      avatarImage: state?.data?.avatarImage ?? '',
      name: state?.data?.name ?? '',
      id: state?.data?.id ?? '',
      currentExperience: state?.data?.currentExperience ?? 0,
      maxExperience: state?.data?.maxExperience ?? 0,
      currentHealth: state?.data?.currentHealth ?? 0,
      currentMana: state?.data?.currentMana ?? 0,
      maxHealth: state?.data?.maxHealth ?? 0,
      maxMana: state?.data?.maxMana ?? 0,
      level: state?.data?.level ?? 0,
      equipments: state?.data?.equipments ?? [],
    }));
  const { mutate, isPending } = useHeroSetState();
  return (
    <section className="flex flex-col gap-1">
      <Button variant="outline" disabled={isPending} onClick={() => mutate('IDLE')} className="ml-auto w-fit">
        <LucideStepBack />
        Back
      </Button>
      <div className="flex gap-4">
        <Paperdoll
          avatarImage={avatarImage}
          currentExperience={currentExperience}
          currentHealth={currentHealth}
          currentMana={currentMana}
          id={id}
          level={level}
          maxExperience={maxExperience}
          maxHealth={maxHealth}
          maxMana={maxMana}
          name={name}
          equipments={equipments}
        />
        <Modifiers />
        <Inventory />
      </div>
    </section>
  );
};
