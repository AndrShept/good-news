import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { useWalkTownCompleteListener } from '@/features/hero/hooks/useWalkTownCompleteListener';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';

export const Game = () => {
  useRegeneration();
  useWalkTownCompleteListener();
  return (
    <section className="flex flex-col">
      <div className="mx-auto flex size-full max-w-7xl flex-col">
        <GameHeader />
        <div className="mx-auto min-h-[calc(100vh-302px)] w-full flex-1 p-3">
          <Outlet />
        </div>
        <GameMessage />
      </div>
      <GroupInvitationModal />
    </section>
  );
};
