import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useHero } from '@/features/hero/hooks/useHero';
import { ActionTimerPanel } from '@/features/map/components/ActionTimerPanel';
import { MovingPanel } from '@/features/map/components/MovingPanel';
import { useCancelGatheringMutation } from '@/features/map/hooks/useCancelGatheringMutation';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';
import { DndInventoryProvider } from './providers/DndInventoryProvider';

export const Game = () => {
  const { gatheringFinishAt, state } = useHero((data) => ({
    state: data?.state,
    gatheringFinishAt: data?.gatheringFinishAt,
  }));
  const cancelGatheringMutation = useCancelGatheringMutation();
  return (
    <>
      <DndInventoryProvider>
        <section className="mx-auto flex max-w-7xl flex-col">
          <GameHeader />

          {state && <MovingPanel heroState={state} />}
          {state && state !== 'IDLE' && !!gatheringFinishAt && (
            <ActionTimerPanel
              heroState={state}
              actionFinishAt={gatheringFinishAt}
              cancelActionMutation={cancelGatheringMutation.mutate}
              cancelIsPending={cancelGatheringMutation.isPending}
              className="top-27 bg-muted/80 absolute left-1/2 z-50 -translate-x-1/2 rounded-b border backdrop-blur-sm sm:top-11"
            />
          )}

          <div className="mx-auto flex min-h-[calc(100vh-315px)] w-full flex-1">
            <Outlet />
          </div>

          <div className="sticky bottom-0 z-10">
            <GameMessage />
          </div>
        </section>
      </DndInventoryProvider>

      <GroupInvitationModal />
    </>
  );
};
