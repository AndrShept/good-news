import { Spinner } from '@/components/Spinner';
import { CharacterPaperdoll } from '@/features/hero/components/CharacterPaperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { NewGameMap } from '@/features/map/components/NewGameMap';
import { Town } from '@/features/place/components/Town';
import { MagicShop } from '@/features/place/components/buildings/MagicShop';
import { Temple } from '@/features/place/components/buildings/Temple';
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
    action: state?.data?.action,
    location: state?.data?.location,
    state: state?.data?.state,
  }));
  const isCharacter = state?.type === 'CHARACTER';
  const isTown = !!location?.placeId && !isCharacter && !location.currentBuilding;
  const isMagicShop = !!location?.placeId && !isCharacter && location.currentBuilding === 'MAGIC-SHOP';
  const isTemple = !!location?.placeId && !isCharacter && location.currentBuilding === 'TEMPLE';
  const isMap = !isCharacter && !!location?.mapId;

  return (
    <>
      {isCharacter && <CharacterPaperdoll />}
      {isTown && <Town />}
      {isMagicShop && <MagicShop />}
      {isTemple && <Temple />}
      {isMap && <NewGameMap />}
    </>
  );
}
