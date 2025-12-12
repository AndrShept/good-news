import { Game } from '@/components/Game';
import { SocketProvider } from '@/components/providers/SocketProvider';
import { getUserQueryOptions } from '@/features/auth/api/get-user';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { getCraftDataOptions } from '@/features/craft/api/get-craft-data';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { useHero } from '@/features/hero/hooks/useHero';
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/game')({
  component: GameRouteComponent,

  beforeLoad: async ({ context }) => {
    const [auth, hero] = await Promise.all([
      context.queryClient.ensureQueryData(getUserQueryOptions()),
      context.queryClient.ensureQueryData(getHeroOptions()),
      context.queryClient.ensureQueryData(getCraftDataOptions()),
    ]);
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
  const auth = useAuth();
  const user = auth ? { id: auth.id, username: auth.username } : undefined;
  const heroId = useHero((state) => state?.data?.id ?? '');

  return (
    <SocketProvider user={user} heroId={heroId}>
      <Game />
    </SocketProvider>
  );
}
