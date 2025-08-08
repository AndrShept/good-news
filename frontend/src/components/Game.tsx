import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';

export const Game = () => {
  useRegeneration();
  return (
    <section className="flex flex-col">
      <div className="mx-auto flex size-full max-w-7xl flex-col">
        <GameHeader />
        <div className="min-h-[calc(100vh-302px)] flex-1 p-3 ">
       
          <Outlet />
        </div>
        <GameMessage />
      </div>
      <GroupInvitationModal />
    </section>
  );
};
