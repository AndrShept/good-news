import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
});

function RouteComponent() {
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

  return (
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
  );
}
