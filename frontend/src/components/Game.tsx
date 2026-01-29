import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';
import { DndInventoryProvider } from './providers/DndInventoryProvider';

export const Game = () => {
  return (
    <>
      <DndInventoryProvider>
        <div className="mx-auto flex max-w-7xl flex-col">
          <GameHeader />
          <div className="mx-auto flex min-h-[calc(100vh-315px)] w-full flex-1">
            <Outlet />
          </div>

          <div className="sticky bottom-0 z-10">
            <GameMessage />
          </div>
        </div>
      </DndInventoryProvider>

      <GroupInvitationModal />
    </>
  );
};
