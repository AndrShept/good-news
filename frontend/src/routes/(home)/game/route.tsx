import { GameMessage } from '@/components/GameMessage';
import { getHeroOptions } from '@/features/hero/api/get-hero';
import { HeroHeader } from '@/features/hero/components/HeroHeader';
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
  return (
    <>
      <HeroHeader />

      <section className="size-full">
        <Outlet />
      </section>

      <section className="bg-background/90 sticky bottom-0 h-[250px]">
        <GameMessage />
      </section>
    </>
  );
}
