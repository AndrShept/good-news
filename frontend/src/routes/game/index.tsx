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
  const avatarImage = useHero((state) => state?.data?.avatarImage ?? '');
  const name = useHero((state) => state?.data?.name ?? '');
  const id = useHero((state) => state?.data?.id ?? '');
  const currentExperience = useHero((state) => state?.data?.currentExperience ?? 0);
  const maxExperience = useHero((state) => state?.data?.maxExperience ?? 0);
  const currentHealth = useHero((state) => state?.data?.currentHealth ?? 0);
  const currentMana = useHero((state) => state?.data?.currentMana ?? 0);
  const maxHealth = useHero((state) => state?.data?.maxHealth ?? 0);
  const maxMana = useHero((state) => state?.data?.maxMana ?? 0);
  const level = useHero((state) => state?.data?.level ?? 0);
  const equipments = useHero((state) => state?.data?.equipments ?? []);
  useRegeneration();
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
