import { GameMessage } from '@/components/GameMessage';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/(home)/game')({
  component: GameRouteComponent,
  beforeLoad: async ({ context }) => {
    const hero = await context.queryClient.ensureQueryData(getHeroOptions());
    if (!hero)
      throw redirect({
        to: '/create-hero',
      });
  },
});

function GameRouteComponent() {
  return (
    <>
      <GameHeader />
      <div className="flex-1">
        <Outlet />
      </div>
      <GameMessage />
    </>
  );
}
