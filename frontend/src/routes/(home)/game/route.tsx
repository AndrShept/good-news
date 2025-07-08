import { GameMessage } from '@/components/GameMessage';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { GameHeader } from '@/features/hero/components/GameHeader';
import { useHero } from '@/features/hero/hooks/useHero';
import { socket } from '@/socket';
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import { useEffect } from 'react';

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
  const heroId = useHero((state) => state?.data?.id ?? '');
  useEffect(() => {
    socket.on(`invite-party-${heroId}`, (data: { accept: boolean }, cb: (params: { accept: boolean }) => void) => {
      console.log(data);
      cb({ accept: true });
    });
  }, [heroId]);

  return (
    <>
      <GameHeader />
      <div className="flex-1">
        <Outlet />
      </div>

      <section className="bg-background/90 sticky bottom-0 h-[250px]">
        <GameMessage />
      </section>
    </>
  );
}
