import { GameMessage } from '@/components/GameMessage';
import { Spinner } from '@/components/Spinner';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useRegeneration } from '@/features/hero/hooks/useRegeneration';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/game')({
  component: GameRouteComponent,
 
  beforeLoad: async ({ context }) => {
    const auth = await context.queryClient.ensureQueryData(getUserQueryOptions());
    const hero = await context.queryClient.ensureQueryData(getHeroOptions());

    if (!auth) {
      throw redirect({ to: '/auth/sign-in' });
    }
    if (auth && !hero) {
      throw redirect({ to: '/create-hero' });
    }
    return {
      auth,
      hero,
    };
  },
});

function GameRouteComponent() {
  useRegeneration();
  return (
    <section className="flex flex-col">
      <div className="mx-auto flex size-full max-w-7xl flex-col">
        <GameHeader />
        <div className="min-h-[calc(100vh-302px)] flex-1 p-3">
          <Outlet />
        </div>
        <GameMessage />
      </div>
    </section>
  );
}
