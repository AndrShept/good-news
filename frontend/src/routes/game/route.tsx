import { ActionTimerPanel } from '@/components/ActionTimerPanel';
import { GameConsole } from '@/components/GameConsole';
import { DndInventoryProvider } from '@/components/providers/DndInventoryProvider';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { getGameDataOptions } from '@/features/hero/api/get-game-data';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useHero } from '@/features/hero/hooks/useHero';
import { useHeroId } from '@/features/hero/hooks/useHeroId';
import { MovingPanel } from '@/features/map/components/MovingPanel';
import { useCancelGatheringMutation } from '@/features/map/hooks/useCancelGatheringMutation';

import { useMovementPathTileStore } from '@/store/useMovementPathTileStore';
import { useNavigate } from '@tanstack/react-router';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { Outlet } from '@tanstack/react-router';
import { useEffect } from 'react';

export const Route = createFileRoute('/game')({
  component: GameRouteComponent,

  beforeLoad: async ({ context }) => {
    const [hero] = await Promise.all([
      context.queryClient.ensureQueryData(getHeroOptions()),
      context.queryClient.ensureQueryData(getGameDataOptions()),
    ]);
  
    if (!hero) {
      throw redirect({ to: '/create-hero' });
    }
    if (hero?.battleId && !location.pathname.includes('/battle/')) {
      throw redirect({ to: '/game/battle/$battleId', params: { battleId: hero.battleId } });
    }

    return {
      hero,
    };
  },

});

function GameRouteComponent() {
  const auth = useAuth();
  const heroId = useHeroId();
  const navigate = useNavigate();
  const { gatheringFinishAt, state, battleId } = useHero((data) => ({
    state: data?.state,
    gatheringFinishAt: data?.gatheringFinishAt,
    battleId: data?.battleId,
  }));
  const cancelGatheringMutation = useCancelGatheringMutation();
  const movementPathTiles = useMovementPathTileStore((state) => state.movementPathTiles);

  useEffect(() => {
    if (battleId) {
      navigate({ to: '/game/battle/$battleId', params: { battleId } });
    }
  }, [battleId]);

  return (
    <SocketProvider username={auth?.username} userId={auth?.id} heroId={heroId}>
      <DndInventoryProvider>
        <section className="mx-auto flex max-w-7xl flex-col">
          <GameHeader />

          {state && !!movementPathTiles.length && <MovingPanel heroState={state} movementPathTiles={movementPathTiles} />}
          {state && state !== 'IDLE' && !!gatheringFinishAt && (
            <ActionTimerPanel
              heroState={state}
              actionFinishAt={gatheringFinishAt}
              cancelActionMutation={cancelGatheringMutation.mutate}
              cancelIsPending={cancelGatheringMutation.isPending}
              className="top-27 absolute left-1/2 z-50 -translate-x-1/2 sm:top-11"
            />
          )}

          <div className="mx-auto flex min-h-[calc(100vh-315px)] w-full flex-1">
            <Outlet />
          </div>

          <div className="sticky bottom-0 z-10">
            <GameConsole />
          </div>
        </section>
      </DndInventoryProvider>

      <GroupInvitationModal />
    </SocketProvider>
  );
}
