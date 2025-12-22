import { Spinner } from '@/components/Spinner';
import { ModalProvider } from '@/components/providers/ModalProvider';
import { CharacterPaperdoll } from '@/features/hero/components/CharacterPaperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { NewGameMap } from '@/features/map/components/NewGameMap';
import { Place } from '@/features/place/components/Place';
import { Skills } from '@/features/skill/components/Skills';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/game/')({
  component: RouteComponent,
  pendingComponent: () => (
    <div className="flex h-[calc(100vh-295px)] w-full items-center justify-center">
      <Spinner size={'sm'} />
    </div>
  ),
});

function RouteComponent() {
  const { currentBuilding, type, mapId, placeId } = useHero((state) => ({
    currentBuilding: state?.data?.location?.currentBuilding,
    type: state?.data?.state?.type,
    placeId: state?.data?.location?.placeId,
    mapId: state?.data?.location?.mapId,
  }));
  const isCharacter = type === 'CHARACTER';
  const isSkills = type === 'SKILLS';
  const isPlace = !!placeId && !isCharacter && !isSkills && !currentBuilding;
  const isMap = !isCharacter && !isSkills && !!mapId;

  return (
    <>
      {isCharacter && <CharacterPaperdoll />}
      {isSkills && <Skills />}
      {isPlace && <Place />}
      {isMap && <NewGameMap />}
      <ModalProvider />
    </>
  );
}
