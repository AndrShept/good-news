import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { ActionTimeRemaining } from '@/features/hero/components/ActionTimeRemaining';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';

export const Game = () => {
  return (
    <>
      <div className="mx-auto flex max-w-7xl flex-col">
        <GameHeader />
        <div className="mx-auto flex min-h-[calc(100vh-315px)] w-full flex-1 items-start">
          <Outlet />
        </div>
        <div className="sticky bottom-0 z-10">
          <ActionTimeRemaining />
          <GameMessage />
        </div>
      </div>
      <GroupInvitationModal />
    </>
  );
};
