import { GroupInvitationModal } from '@/features/group/components/GroupInvitationModal';
import { ActionTimeRemaining } from '@/features/hero/components/ActionTimeRemaining';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { useWalkMapCompleteListener } from '@/features/hero/hooks/useWalkMapCompleteListener';
import { useWalkTownCompleteListener } from '@/features/hero/hooks/useWalkTownCompleteListener';
import { Outlet } from '@tanstack/react-router';

import { GameMessage } from './GameMessage';

export const Game = () => {
  useRegeneration();
  useWalkTownCompleteListener();
  useWalkMapCompleteListener();

  return (
    <section className="flex flex-col">
      <div className="mx-auto flex size-full max-w-7xl flex-col">
        <GameHeader />
        <div className="mx-auto min-h-[calc(100vh-315px)] w-full flex-1 p-3">
          <Outlet />
        </div>
        <div className="sticky bottom-0 z-10">
          <ActionTimeRemaining />
          <GameMessage />
        </div>
      </div>
      <GroupInvitationModal />
    </section>
  );
};
