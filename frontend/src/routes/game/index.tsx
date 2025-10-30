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
  const { currentBuilding, type,mapId,placeId } = useHero((state) => ({
    currentBuilding: state?.data?.location?.currentBuilding,
    type: state?.data?.state?.type,
    placeId: state?.data?.location?.placeId ,
    mapId: state?.data?.location?.mapId ,
  }));
  const isCharacter = type === 'CHARACTER';
  const isTown = !!placeId && !isCharacter && !currentBuilding;
  const isMagicShop = !!placeId && !isCharacter && currentBuilding === 'MAGIC-SHOP';
  const isTemple = !!placeId && !isCharacter && currentBuilding === 'TEMPLE';
  const isMap = !isCharacter && !!mapId;

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
