import { GameMessage } from '@/components/GameMessage';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useHero } from '@/features/hero/hooks/useHero';
import { SocketProvider } from '@/hooks/useSocket';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/game')({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    const hero = await context.queryClient.ensureQueryData(getHeroOptions());
    if (!hero)
      throw redirect({
        to: '/create-hero',
      });
  },
});

function RouteComponent() {
  const user = useAuth();
  const hero = useHero();
  return (
    <>
      <SocketProvider user={{ id: user?.id ?? '', username: user?.username ?? '' }} heroId={hero.id}>
        <GameHeader />
        <div className="flex-1">
          <Outlet />
        </div>

        <section className="bg-background/90 sticky bottom-0 h-[250px]">
          <GameMessage />
        </section>
      </SocketProvider>
    </>
  );
}
