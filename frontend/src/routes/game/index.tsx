import { Spinner } from '@/components/Spinner';
import { CharacterPaperdoll } from '@/features/hero/components/CharacterPaperdoll';
import { useHero } from '@/features/hero/hooks/useHero';
import { Town } from '@/features/town/components/Town';
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
  const { location, action, state } = useHero((state) => ({
    action: state?.data?.action,
    location: state?.data?.location,
    state: state?.data?.state,
  }));
  const isCharacter = state?.type === 'CHARACTER';
  const isTown = !!location?.townId && !isCharacter;
  return (
    <>
      {isCharacter && <CharacterPaperdoll />}
      {isTown && <Town />}
    </>
  );
}
