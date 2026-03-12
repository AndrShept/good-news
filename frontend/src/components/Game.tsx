import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useHero } from '@/features/hero/hooks/useHero';
import { GatheringPanel } from '@/features/map/components/GatheringPanel';
import { MovingPanel } from '@/features/map/components/MovingPanel';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';
import { DndInventoryProvider } from './providers/DndInventoryProvider';

export const Game = () => {
  const { gatheringFinishAt, state, } = useHero((data) => ({
    state: data?.state,
    gatheringFinishAt: data?.gatheringFinishAt,

  }));
  return (
    <>
      <DndInventoryProvider>
        <section className="mx-auto flex max-w-7xl flex-col">
          <GameHeader />

          {state && <MovingPanel heroState={state} />}
          {state && state !== 'IDLE' && !!gatheringFinishAt && <GatheringPanel heroState={state} gatheringFinishAt={gatheringFinishAt} />}

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
