import { Spinner } from '@/components/Spinner';
import { ModalProvider } from '@/components/providers/ModalProvider';
import { CharacterPaperdoll } from '@/features/hero/components/CharacterPaperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { GameMapLayout } from '@/features/map/components/GameMapLayout';
import { Place } from '@/features/place/components/Place';
import { useHeroUIStore } from '@/store/useHeroUIStore';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-[calc(100vh-295px)] w-full items-center justify-center ">
      <Spinner size={'sm'} />
    </div>
  ),
});

function RouteComponent() {
  const { mapId, placeId } = useHero((data) => ({
    placeId: data?.location?.placeId,
    mapId: data?.location?.mapId,
  }));
  const { uiType } = useHeroUIStore();
  const isCharacter = uiType === 'CHARACTER';
  const isPlace = !!placeId && !isCharacter;
  const isMap = !isCharacter && !!mapId;

  return (
    <>
      {isCharacter && <CharacterPaperdoll />}
      {isPlace && <Place />}
      {isMap && <GameMapLayout />}
      <ModalProvider />

      {/* <SheetProvider /> */}
    </>
  );
}
