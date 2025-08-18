import { Spinner } from '@/components/Spinner';
import { TownBuilding } from '@/components/TownBuilding';
import { MagicShop } from '@/components/buildings/MagicShop';
import { Temple } from '@/components/buildings/Temple';
import { CharacterPaperdoll } from '@/features/hero/components/CharacterPaperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { Map } from '@/features/map/components/GameMap';
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
  const { location, state } = useHero((state) => ({
    state: state?.data?.state,
    location: state?.data?.location,
  }));
  const isCharacter = state?.type === 'CHARACTER';
  const isTownEntry = location?.type === 'TOWN' && location.name === 'SOLMERE' && location.buildingType === 'NONE' && !isCharacter;
  const isMagicShop = location?.type === 'TOWN' && location.buildingType === 'MAGIC-SHOP' && !isCharacter;
  const isTemple = location?.type === 'TOWN' && location.buildingType === 'TEMPLE' && !isCharacter;
  const isMap = location?.type === 'MAP' && location.buildingType === 'NONE' && !isCharacter;
  return (
    <>
      {isTownEntry && (
        <div className="flex">
          <TownBuilding buildingType="MAGIC-SHOP" />
          <TownBuilding buildingType="TEMPLE" />
          <TownBuilding buildingType="LEAVE-TOWN" />
        </div>
      )}

      {isMagicShop && <MagicShop />}
      {isTemple && <Temple />}
      {isCharacter && <CharacterPaperdoll />}
      {isMap && <Map />}
    </>
  );
}
