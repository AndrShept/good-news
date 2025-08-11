import { Spinner } from '@/components/Spinner';
import { TownBuilding } from '@/components/TownBuilding';
import { MagicShop } from '@/components/buildings/MagicShop';
import { Temple } from '@/components/buildings/Temple';
import { ActionTimeRemaining } from '@/features/hero/components/ActionTimeRemaining';
import { Inventory } from '@/features/hero/components/Inventory';
import { Modifiers } from '@/features/hero/components/Modifier';
import { Paperdoll } from '@/features/hero/components/Paperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-[calc(100vh-295px)] items-center justify-center">
      <Spinner size={'sm'} />
    </div>
  ),
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
  const action = useHero((state) => state?.data?.action);
  const state = useHero((state) => state?.data?.state);
  const location = useHero((state) => state?.data?.location);
  const isCharacter = state?.type === 'CHARACTER';
  const isTownEntry = location?.type === 'TOWN' && location.buildingType === 'NONE';
  const isMagicShop = location?.type === 'TOWN' && location.buildingType === 'MAGIC-SHOP';
  const isTemple = location?.type === 'TOWN' && location.buildingType === 'TEMPLE';
  return (
    <>
      {isTownEntry && (
        <div className="flex">
          <TownBuilding buildingType="MAGIC-SHOP" />
          <TownBuilding buildingType="TEMPLE" />
        </div>
      )}
      <ActionTimeRemaining />
      {isMagicShop && <MagicShop />}
      {isTemple && <Temple />}
      {isCharacter && (
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
      )}
    </>
  );
}
